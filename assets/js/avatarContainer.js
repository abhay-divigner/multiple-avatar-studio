(function ($) {
  "use strict";

  // Global settings from PHP
  const settings = window.avatarSettings || {};

  // DOM Ready
  $(document).ready(function () {
    initializeFullscreenToggle();
    initializeLanguageSwitcher();

    // Only check camera if the container exists
    if (document.getElementById("userVideoContainer")) {
      checkCameraAvailability();
    } else {
      console.log("No userVideoContainer found, skipping camera check");
    }

    if (settings.userFormEnable) {
      initializeUserForm();
    }
  });

  // Fullscreen toggle functionality
  function initializeFullscreenToggle() {
    const fullscreenContainers = document.querySelectorAll(
      ".chatBox-fullscreen"
    );

    function toggleAllFullscreenIcons() {
      const allExpandIcons = document.querySelectorAll(".fa-expand");
      const allCompressIcons = document.querySelectorAll(".fa-compress");

      const expandVisible =
        allExpandIcons[0] && allExpandIcons[0].style.display !== "none";

      if (expandVisible) {
        allExpandIcons.forEach((icon) => (icon.style.display = "none"));
        allCompressIcons.forEach(
          (icon) => (icon.style.display = "inline-block")
        );
      } else {
        allExpandIcons.forEach((icon) => (icon.style.display = "inline-block"));
        allCompressIcons.forEach((icon) => (icon.style.display = "none"));
      }
    }

    fullscreenContainers.forEach(function (container) {
      container.addEventListener("click", function (e) {
        e.preventDefault();
        toggleAllFullscreenIcons();
      });
    });
  }

  // Camera availability check
  function checkCameraAvailability() {
    const userVideoContainer = document.getElementById("userVideoContainer");

    // If container doesn't exist, exit early
    if (!userVideoContainer) {
      console.warn("userVideoContainer element not found");
      return;
    }

    // Check if browser supports mediaDevices API
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.warn("Media devices API not supported in this browser");
      hideUserVideoContainer(userVideoContainer);
      return;
    }

    // First check if we're in a secure context
    if (!isSecureContext()) {
      console.warn("Camera access requires secure context (HTTPS)");
      hideUserVideoContainer(userVideoContainer);
      return;
    }

    // Try to enumerate devices with better error handling
    navigator.mediaDevices
      .enumerateDevices()
      .then(function (devices) {
        console.log("Available devices:", devices);
        const hasVideoInput = devices.some(
          (device) => device.kind === "videoinput"
        );

        if (!hasVideoInput) {
          console.log("No video input devices found");
          hideUserVideoContainer(userVideoContainer);
        } else {
          console.log("Video input devices available");
          userVideoContainer.style.display = "block";
        }
      })
      .catch(function (err) {
        // More specific error handling
        console.error(
          "Error checking camera availability:",
          err.name,
          err.message
        );

        // Log specific error types
        if (err.name === "NotAllowedError") {
          console.error("Permission denied by user or system");
        } else if (err.name === "NotFoundError") {
          console.error("No camera found");
        } else if (err.name === "NotReadableError") {
          console.error("Camera is in use by another application");
        } else if (err.name === "OverconstrainedError") {
          console.error("Camera doesn't meet constraints");
        } else if (err.name === "SecurityError") {
          console.error("Camera access blocked by security policy");
        }

        hideUserVideoContainer(userVideoContainer);
      });
  }

  // Helper function to check secure context
  function isSecureContext() {
    return (
      window.isSecureContext ||
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    );
  }

  // Updated hide function that accepts element parameter
  function hideUserVideoContainer(container) {
    if (container) {
      container.style.display = "none";
    }
  }

  // Language switcher functions
  function setLanguage(langCode, countryCode, languageName) {
    const selectedLanguage = document.getElementById("selectedLanguage");
    if (selectedLanguage) {
      selectedLanguage.innerHTML = `<img draggable="false" class="emoji" alt="${countryCode}" 
                src="https://s.w.org/images/core/emoji/16.0.1/svg/1f1${countryCode.toLowerCase()}.svg">`;
    }

    // Hide dropdown after selection
    const languageDropdown = document.getElementById("languageDropdown");
    if (languageDropdown) {
      languageDropdown.style.display = "none";
    }

    // Update any language-specific content here
    console.log("Language changed to:", languageName);
  }

  function toggleLanguageDropdown() {
    const languageDropdown = document.getElementById("languageDropdown");
    if (languageDropdown) {
      if (
        languageDropdown.style.display === "none" ||
        languageDropdown.style.display === ""
      ) {
        languageDropdown.style.display = "block";
      } else {
        languageDropdown.style.display = "none";
      }
    }
  }

  function initializeLanguageSwitcher() {
    // Make functions globally available for onclick handlers
    window.setLanguage = setLanguage;
    window.toggleLanguageDropdown = toggleLanguageDropdown;

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
      const languageDropdown = document.getElementById("languageDropdown");
      const langIcon = document.querySelector(".lang-icon");

      if (
        languageDropdown &&
        langIcon &&
        !langIcon.contains(event.target) &&
        !languageDropdown.contains(event.target)
      ) {
        languageDropdown.style.display = "none";
      }
    });
  }

  // User form handling
  function initializeUserForm() {
    const instructionSectionExists = $("#instruction").length > 0;

    console.log("=== AVATAR FORM INITIALIZATION ===");
    console.log("Form ID:", settings.formId);
    console.log("Instruction Enabled:", settings.instructionEnabled);
    console.log("Instruction Section Exists:", instructionSectionExists);

    // Handle instruction agree button click
    $(document).on("click", "#instructionAgree", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      console.log("Instruction agree button clicked");

      $("#instruction").hide(300, function () {
        console.log("Instruction section hidden");
        startSession();
      });
    });

    // Form submission handler
    $("#userDetailsForm").on("submit", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      console.log("=== FORM SUBMIT TRIGGERED ===");

      // Clear previous error messages
      $(".error-message").remove();

      // Validate form
      let isValid = true;
      let firstErrorField = null;

      $(".form-field.required").each(function () {
        const $field = $(this);
        const $input = $field.find("input, select, textarea").first();
        const value = $input.val();

        // For checkboxes
        if ($input.is('[type="checkbox"]')) {
          const name = $input.attr("name");
          const checked = $(`input[name="${name}"]:checked`).length > 0;
          if (!checked) {
            isValid = false;
            $field.addClass("error");
            if (!firstErrorField) firstErrorField = $field;
          } else {
            $field.removeClass("error");
          }
        }
        // For radio buttons
        else if ($input.is('[type="radio"]')) {
          const name = $input.attr("name");
          const checked = $(`input[name="${name}"]:checked`).length > 0;
          if (!checked) {
            isValid = false;
            $field.addClass("error");
            if (!firstErrorField) firstErrorField = $field;
          } else {
            $field.removeClass("error");
          }
        }
        // For other fields
        else if (!value || value.trim() === "") {
          isValid = false;
          $field.addClass("error");
          if (!firstErrorField) firstErrorField = $field;
        } else {
          $field.removeClass("error");
        }
      });

      // Show error if validation fails
      if (!isValid) {
        console.log("Form validation failed");
        $("#userDetailsForm").prepend(
          '<div class="error-message" style="color: #ef4444; padding: 10px; margin-bottom: 15px; background: #fef2f2; border-radius: 6px; border: 1px solid #fecaca;">Please fill in all required fields marked with *</div>'
        );

        // Scroll to first error field
        if (firstErrorField) {
          $("html, body").animate(
            {
              scrollTop: firstErrorField.offset().top - 100,
            },
            500
          );
        }
        return false;
      }

      console.log("Form validation passed, hiding form...");

      // Hide the form
      $("#userform")
        .css({
          opacity: "0",
          height: "0",
          overflow: "hidden",
          margin: "0",
          padding: "0",
          border: "none",
          visibility: "hidden",
          "pointer-events": "none",
          position: "absolute",
          "z-index": "-9999",
        })
        .hide()
        .off();

      console.log(
        "Form should be hidden now. Checking visibility:",
        $("#userform").is(":visible")
      );

      // Collect form data
      const formData = {};
      $(".form-field").each(function () {
        const $field = $(this);
        const label = $field
          .find("label")
          .first()
          .text()
          .replace(" *", "")
          .trim();
        const $input = $field.find("input, select, textarea").first();

        if (!$input.length || !label) return;

        // Handle checkboxes (multiple values)
        if ($input.is('[type="checkbox"]')) {
          const name = $input.attr("name");
          if (!name) return;

          const values = [];
          $field.find(`input[name="${name}"]:checked`).each(function () {
            values.push($(this).val());
          });
          formData[label] = values.length > 0 ? values : [];
        }
        // Handle radio buttons (single value)
        else if ($input.is('[type="radio"]')) {
          const name = $input.attr("name");
          if (!name) return;

          const value = $field.find(`input[name="${name}"]:checked`).val();
          formData[label] = value || "";
        }
        // Handle other input types
        else {
          formData[label] = $input.val() || "";
        }
      });

      console.log("Form data collected:", formData);

      // Get session ID
      let sessionId = $('input[name="session_id"]').val();
      if (!sessionId) {
        sessionId = "session_" + Date.now();
      }

      // Get avatar studio ID
      const avatarStudioId = $('input[name="avatar_studio_id"]').val() || 0;

      console.log("Submitting form via AJAX...");

      // Submit via AJAX
      $.ajax({
        url: settings.ajaxUrl,
        type: "POST",
        data: {
          action: "submit_avatar_form",
          form_id: settings.formId,
          session_id: sessionId,
          avatar_studio_id: avatarStudioId,
          form_data: JSON.stringify(formData),
          nonce: settings.nonce,
        },
        beforeSend: function () {
          $("#nextBtn").prop("disabled", true);
          console.log("AJAX request sent");
        },
        success: function (response) {
          console.log("AJAX response received:", response);

          if (response.success) {
            console.log("Form submitted successfully via AJAX");

            // Double-check form is hidden
            $("#userform").hide();

            // Form is already hidden, now decide where to go next
            if (settings.instructionEnabled && instructionSectionExists) {
              console.log("Redirecting to instruction section");
              scrollToInstruction();
            } else {
              console.log("Starting session directly");
              startSession();
            }
          } else {
            console.log("AJAX submission failed, form stays hidden");
            console.error("Form submission error:", response.data);
          }
        },
        error: function (xhr, status, error) {
          console.error("AJAX error:", error);
          console.log("AJAX network error, form stays hidden");
        },
        complete: function () {
          $("#nextBtn").prop("disabled", false);
          console.log("AJAX request complete");
        },
      });

      return false;
    });

    // Real-time validation
    $(
      ".form-field.required input, .form-field.required select, .form-field.required textarea"
    ).on("blur change", function () {
      const $field = $(this).closest(".form-field");
      const $input = $field.find("input, select, textarea").first();
      const value = $input.val();

      if ($input.is('[type="checkbox"], [type="radio"]')) {
        const name = $input.attr("name");
        const checked = $(`input[name="${name}"]:checked`).length > 0;
        if (!checked) {
          $field.addClass("error");
        } else {
          $field.removeClass("error");
          $(".error-message").remove();
        }
      } else if (!value || value.trim() === "") {
        $field.addClass("error");
      } else {
        $field.removeClass("error");
        $(".error-message").remove();
      }
    });

    // Skip button handler
    $("#skipBtn").on("click", function () {
      console.log("Skip button clicked");

      // Hide the form
      $("#userform")
        .css({
          opacity: "0",
          height: "0",
          overflow: "hidden",
          margin: "0",
          padding: "0",
          border: "none",
          visibility: "hidden",
          "pointer-events": "none",
          position: "absolute",
          "z-index": "-9999",
        })
        .hide();

      // Decide where to go next
      if (settings.instructionEnabled && instructionSectionExists) {
        console.log("Redirecting to instruction section after skip");
        scrollToInstruction();
      } else {
        console.log("Starting session directly after skip");
        startSession();
      }
    });
  }

  // Function to scroll to instruction section
  function scrollToInstruction() {
    console.log("Scrolling to instruction section");

    const $instructionSection = $("#instruction");

    if ($instructionSection.length > 0) {
      // Show instruction section if hidden
      if ($instructionSection.is(":hidden")) {
        $instructionSection.show();
      }

      // Briefly highlight the section
      $instructionSection.css({
        display: "flex",
      });
    } else {
      console.log("No instruction section found, starting session");
      startSession();
    }
  }

  // Function to start the session
  function startSession() {
    console.log("Starting session...");

    // Method 1: Trigger click on start session button
    if ($("#startSession").length > 0) {
      console.log("Found #startSession button, triggering click");
      $("#startSession").trigger("click");
    }
    // Method 2: Call startSession function if it exists
    else if (typeof window.startSession === "function") {
      console.log("Calling window.startSession() function");
      window.startSession();
    }
    // Method 3: Try other common session start selectors
    else {
      const sessionTriggers = [
        "#beginSession",
        ".start-session",
        "[data-start-session]",
        ".session-start-btn",
        "#start-session-btn",
      ];

      let sessionFound = false;
      for (const selector of sessionTriggers) {
        if ($(selector).length > 0) {
          console.log("Found session trigger:", selector);
          $(selector).trigger("click");
          sessionFound = true;
          break;
        }
      }

      // If no trigger found, log a message
      if (!sessionFound) {
        console.log("No session start trigger found");
      }
    }
  }

  // Make functions available globally
  window.scrollToInstruction = scrollToInstruction;
  window.startSession = startSession;
})(jQuery);
