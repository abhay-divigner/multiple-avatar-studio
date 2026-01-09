/**
 * Avatar Studio JavaScript
 * All inline scripts extracted to external file
 */

(function () {
  "use strict";

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAvatarStudio);
  } else {
    initializeAvatarStudio();
  }

  function initializeAvatarStudio() {
    // Initialize language on page load
    setLanguage("en", "us", "English");

    // Initialize fullscreen toggle functionality
    initFullscreenToggle();

    // Initialize camera availability check
    if (window.avatarStudioConfig && window.avatarStudioConfig.video_enable) {
      checkCameraAvailability();
    }

    // Initialize form handling if user form is enabled
    if (
      window.avatarStudioConfig &&
      window.avatarStudioConfig.user_form_enable
    ) {
      initFormHandling();
    }

    // Initialize instruction handling
    initInstructionHandling();
  }

  /**
   * Initialize fullscreen toggle functionality
   */
  function initFullscreenToggle() {
    const fullscreenContainers = document.querySelectorAll(
      ".chatBox-fullscreen"
    );

    function toggleAllFullscreenIcons() {
      const allExpandIcons = document.querySelectorAll(".fa-expand");
      const allCompressIcons = document.querySelectorAll(".fa-compress");

      if (allExpandIcons.length === 0) return;

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

  /**
   * Check for camera availability
   */
  function checkCameraAvailability() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      hideUserVideoContainer();
      return;
    }

    navigator.mediaDevices
      .enumerateDevices()
      .then(function (devices) {
        const hasVideoInput = devices.some(
          (device) => device.kind === "videoinput"
        );

        if (!hasVideoInput) {
          hideUserVideoContainer();
        } else {
          const userVideoContainer =
            document.getElementById("userVideoContainer");
          if (userVideoContainer) {
            userVideoContainer.style.display = "block";
          }
        }
      })
      .catch(function (err) {
        console.error("Error checking camera availability:", err);
        hideUserVideoContainer();
      });
  }

  /**
   * Hide user video container
   */
  function hideUserVideoContainer() {
    const userVideoContainer = document.getElementById("userVideoContainer");
    if (userVideoContainer) {
      userVideoContainer.style.display = "none";
    }
  }

  /**
   * Initialize instruction handling
   */
  function initInstructionHandling() {
    document.addEventListener("click", function (e) {
      if (
        e.target.id === "instructionAgree" ||
        e.target.closest("#instructionAgree")
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
        console.log("Instruction agree button clicked");

        const instructionSection = document.getElementById("instruction");
        if (instructionSection) {
          instructionSection.style.display = "none";
          console.log("Instruction section hidden");
          startSession();
        }
      }
    });
  }

  /**
   * Initialize form handling
   */
  function initFormHandling() {
    if (typeof jQuery === "undefined") {
      console.error("jQuery is required for form handling");
      return;
    }

    jQuery(document).ready(function ($) {
      const config = window.avatarStudioConfig || {};
      const instructionEnabled = config.instruction_enable || false;
      const currentFormId = config.form_id || 0;
      const instructionSectionExists = $("#instruction").length > 0;

      console.log("=== AVATAR FORM DEBUG ===");
      console.log("Form ID:", currentFormId);
      console.log("Instruction Enabled:", instructionEnabled);
      console.log("Instruction Section Exists:", instructionSectionExists);
      console.log("Form Container (#userform) found:", $("#userform").length);

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

        $(".error-message").remove();

        let isValid = true;
        let firstErrorField = null;

        $(".form-field.required").each(function () {
          const $field = $(this);
          const $input = $field.find("input, select, textarea").first();
          const value = $input.val();

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
          } else if ($input.is('[type="radio"]')) {
            const name = $input.attr("name");
            const checked = $(`input[name="${name}"]:checked`).length > 0;
            if (!checked) {
              isValid = false;
              $field.addClass("error");
              if (!firstErrorField) firstErrorField = $field;
            } else {
              $field.removeClass("error");
            }
          } else if (!value || value.trim() === "") {
            isValid = false;
            $field.addClass("error");
            if (!firstErrorField) firstErrorField = $field;
          } else {
            $field.removeClass("error");
          }
        });

        if (!isValid) {
          console.log("Form validation failed");
          $("#userDetailsForm").prepend(
            '<div class="error-message" style="color: #ef4444; padding: 10px; margin-bottom: 15px; background: #fef2f2; border-radius: 6px; border: 1px solid #fecaca;">Please fill in all required fields marked with *</div>'
          );

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

          if ($input.is('[type="checkbox"]')) {
            const name = $input.attr("name");
            if (!name) return;

            const values = [];
            $field.find(`input[name="${name}"]:checked`).each(function () {
              values.push($(this).val());
            });
            formData[label] = values.length > 0 ? values : [];
          } else if ($input.is('[type="radio"]')) {
            const name = $input.attr("name");
            if (!name) return;

            const value = $field.find(`input[name="${name}"]:checked`).val();
            formData[label] = value || "";
          } else {
            formData[label] = $input.val() || "";
          }
        });

        console.log("Form data collected:", formData);

        let sessionId = $('input[name="session_id"]').val();
        if (!sessionId) {
          sessionId = "session_" + Date.now();
        }

        const avatarStudioId = $('input[name="avatar_studio_id"]').val() || 0;

        console.log("Submitting form via AJAX...");

        $.ajax({
          url: config.ajax_url || "/wp-admin/admin-ajax.php",
          type: "POST",
          data: {
            action: "submit_avatar_form",
            form_id: currentFormId,
            session_id: sessionId,
            avatar_studio_id: avatarStudioId,
            form_data: JSON.stringify(formData),
          },
          beforeSend: function () {
            $("#nextBtn").prop("disabled", true);
            console.log("AJAX request sent");
          },
          success: function (response) {
            console.log("AJAX response received:", response);

            if (response.success) {
              console.log("Form submitted successfully via AJAX");
              $("#userform").hide();

              if (instructionEnabled && instructionSectionExists) {
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

      /**
       * Scroll to instruction section
       */
      function scrollToInstruction() {
        console.log("Scrolling to instruction section");

        const $instructionSection = $("#instruction");

        if ($instructionSection.length > 0) {
          if ($instructionSection.is(":hidden")) {
            $instructionSection.show();
          }

          $instructionSection.css({
            display: "flex",
          });
        } else {
          console.log("No instruction section found, starting session");
          startSession();
        }
      }
    });
  }

  /**
   * Start the session
   */
  function startSession() {
    console.log("Starting session...");

    const startSessionBtn = document.getElementById("startSession");

    if (startSessionBtn) {
      console.log("Found #startSession button, triggering click");
      startSessionBtn.click();
    } else if (typeof window.startSession === "function") {
      console.log("Calling window.startSession() function");
      window.startSession();
    } else {
      const sessionTriggers = [
        "#beginSession",
        ".start-session",
        "[data-start-session]",
        ".session-start-btn",
        "#start-session-btn",
      ];

      let sessionFound = false;
      for (const selector of sessionTriggers) {
        const element = document.querySelector(selector);
        if (element) {
          console.log("Found session trigger:", selector);
          element.click();
          sessionFound = true;
          break;
        }
      }

      if (!sessionFound) {
        console.log("No session start trigger found");
      }
    }
  }

  // Make startSession available globally if needed
  window.avatarStudioStartSession = startSession;
})();

// Apply toast notification styles from configuration
function applyToastStyles(styles) {
  if (!styles) return;

  const toastTypes = [
    "toast-success",
    "toast-error",
    "toast-warning",
    "toast-info",
  ];

  toastTypes.forEach((type) => {
    const style = styles[type];
    if (style) {
      const cssVars = {
        bg: style.background,
        color: style.color,
        "border-color": style["border-color"],
        "border-width": style["border-width"],
        "border-radius": style["border-radius"],
        padding: style.padding,
        "font-size": style["font-size"],
        "box-shadow": style["box-shadow"],
      };

      // Convert type name to CSS class name
      const cssType = type.replace("toast-", "");

      // Apply CSS variables
      Object.entries(cssVars).forEach(([property, value]) => {
        if (value) {
          document.documentElement.style.setProperty(
            `--toast-${cssType}-${property.replace("-", "-")}`,
            value
          );
        }
      });
    }
  });
}

// Call this function when avatar is loaded
// Example:
// const avatarStyles = JSON.parse('<?php echo json_encode($styles); ?>');
// applyToastStyles(avatarStyles);
