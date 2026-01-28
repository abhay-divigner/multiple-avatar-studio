/**
 * Avatar Studio JavaScript
 * All inline scripts extracted to external file
 */

(function () {
  ("use strict");

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
    // Store reference to instruction video and state
    let instructionVideo = null;
    let isInstructionVisible = false;

    // Function to check if instruction is visible
    function checkInstructionVisibility() {
      const instructionSection = document.getElementById("instruction");
      if (!instructionSection) return false;

      // Check if the instruction section is visible
      const style = window.getComputedStyle(instructionSection);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0"
      );
    }

    // Function to autoplay instruction video ONLY when instruction is visible
    function autoPlayInstructionVideo() {
      // First check if instruction is actually visible
      if (!checkInstructionVisibility()) {
        console.log("Instruction not visible, skipping video autoplay");
        return;
      }

      console.log("Instruction is visible, attempting to autoplay video...");

      // Check if we have an instruction video in the instruction body
      const instructionBody = document.querySelector(".instruction-body");
      if (instructionBody) {
        // Find video element
        instructionVideo = instructionBody.querySelector("video");

        if (instructionVideo) {
          console.log("Instruction video found, attempting to autoplay...");

          // Reset video to beginning
          instructionVideo.currentTime = 0;

          // Try to play video with sound
          const playPromise = instructionVideo.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log("Instruction video autoplay started successfully");
              })
              .catch((error) => {
                console.log(
                  "Autoplay with sound failed, trying muted autoplay:",
                  error
                );

                // If autoplay with sound fails, try muted autoplay
                instructionVideo.muted = true;
                instructionVideo
                  .play()
                  .then(() => {
                    console.log("Video playing muted");
                  })
                  .catch((mutedError) => {
                    console.log("Muted autoplay also failed:", mutedError);

                    // If still fails, show play button overlay
                    showVideoPlayOverlay(instructionVideo);
                  });
              });
          }
        } else {
          console.log("No video found in instruction body");
        }
      }
    }

    // Function to show play button overlay
    function showVideoPlayOverlay(videoElement) {
      // Only show overlay if instruction is visible
      if (!checkInstructionVisibility()) return;

      // Create overlay if it doesn't exist
      let overlay = videoElement.parentNode.querySelector(
        ".video-play-overlay"
      );

      if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "video-play-overlay";
        overlay.innerHTML = `
        <button type="button" class="play-video-btn">
          <i class="fas fa-play"></i> Play Video
        </button>
      `;
        overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
      `;

        videoElement.parentNode.style.position = "relative";
        videoElement.parentNode.appendChild(overlay);

        // Add click handler to play button
        overlay
          .querySelector(".play-video-btn")
          .addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Remove overlay
            overlay.remove();

            // Try to play video
            videoElement
              .play()
              .then(() => {
                console.log("Video started via user interaction");
              })
              .catch((error) => {
                console.log("Video play failed:", error);
              });
          });
      }
    }

    // Function to pause instruction video when instruction is hidden
    function pauseInstructionVideo() {
      if (instructionVideo && !instructionVideo.paused) {
        instructionVideo.pause();
        console.log("Instruction video paused because instruction was hidden");
      }
    }

    // Handle instruction agree button click
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
          // Pause video before hiding
          pauseInstructionVideo();
          isInstructionVisible = false;

          instructionSection.style.display = "none";
          console.log("Instruction section hidden");
          startSession();
        }
      }
    });

    // Handle close instruction button
    document.addEventListener("click", function (e) {
      if (
        e.target.id === "closeInstruction" ||
        e.target.closest("#closeInstruction")
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
        console.log("Close instruction button clicked");

        const instructionSection = document.getElementById("instruction");
        if (instructionSection) {
          // Pause video before hiding
          pauseInstructionVideo();
          isInstructionVisible = false;

          instructionSection.style.display = "none";
          console.log("Instruction section hidden");
        }
      }
    });

    // Handle instruction button click to show instruction
    document.addEventListener("click", function (e) {
      if (
        e.target.classList.contains("instruction") ||
        e.target.closest(".instruction")
      ) {
        e.preventDefault();
        console.log("Instruction button clicked to show instruction");

        // Get the instruction section
        const instructionSection = document.getElementById("instruction");
        if (instructionSection) {
          // Show the instruction section
          instructionSection.style.display = "flex";
          isInstructionVisible = true;

          console.log("Instruction section shown, will autoplay video");

          // Wait for the instruction section to be fully visible in the DOM
          setTimeout(() => {
            autoPlayInstructionVideo();
          }, 100);
        }
      }
    });

    // Observe when instruction container becomes visible (for any other way it might be shown)
    const instructionObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          const instructionSection = document.getElementById("instruction");
          if (
            instructionSection &&
            instructionSection.style.display !== "none"
          ) {
            console.log(
              "Instruction section style changed, checking visibility..."
            );

            // Small delay to ensure the element is actually visible
            setTimeout(() => {
              if (checkInstructionVisibility()) {
                console.log("Instruction is now visible, auto-playing video");
                autoPlayInstructionVideo();
                isInstructionVisible = true;
              } else {
                console.log("Instruction is not actually visible yet");
                isInstructionVisible = false;
              }
            }, 50);
          } else if (
            instructionSection &&
            instructionSection.style.display === "none"
          ) {
            // Instruction hidden, pause video
            pauseInstructionVideo();
            isInstructionVisible = false;
          }
        }
      });
    });

    const instructionSection = document.getElementById("instruction");
    if (instructionSection) {
      instructionObserver.observe(instructionSection, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });

      // Check initial state on page load
      if (checkInstructionVisibility()) {
        console.log("Instruction visible on page load, auto-playing video");
        setTimeout(() => {
          autoPlayInstructionVideo();
          isInstructionVisible = true;
        }, 500);
      } else {
        isInstructionVisible = false;
      }
    }

    // Also add an IntersectionObserver to detect when instruction is in viewport
    if (instructionSection && "IntersectionObserver" in window) {
      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log("Instruction section is in viewport");
              isInstructionVisible = true;
              autoPlayInstructionVideo();
            } else {
              console.log("Instruction section is out of viewport");
              pauseInstructionVideo();
              isInstructionVisible = false;
            }
          });
        },
        {
          threshold: 0.5,
          rootMargin: "0px",
        }
      );

      intersectionObserver.observe(instructionSection);
    }
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

        // First, validate required fields
        $(".form-field.required").each(function () {
          const $field = $(this);
          const fieldType = $field.hasClass("other-field")
            ? "other"
            : $field.attr("class").split(" ")[0].replace("-field", "");

          if (fieldType === "other") {
            // For conditional textarea, check if checkbox is checked AND textarea is required
            const $checkbox = $field.find(".conditional-checkbox-input");
            const $textarea = $field.find(".other-input");
            const isTextareaRequired = $textarea.data("required") === "true";

            if ($checkbox.is(":checked") && isTextareaRequired) {
              const textareaValue = $textarea.val().trim();
              if (!textareaValue) {
                isValid = false;
                $field.addClass("error");
                if (!firstErrorField) firstErrorField = $field;

                // Add specific error message
                if (!$field.find(".other-error").length) {
                  $field
                    .find(".other")
                    .append(
                      '<div class="other-error error-message" style="color: #ef4444; font-size: 12px; margin-top: 5px;">This field is required</div>'
                    );
                }
              } else {
                $field.removeClass("error");
                $field.find(".other-error").remove();
              }
            } else {
              $field.removeClass("error");
              $field.find(".other-error").remove();
            }
          } else {
            // Handle other field types as before
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

        console.log("Form validation passed, collecting data...");

        // SIMPLER VERSION - Collect all inputs
        const formData = {};

        // Process each form field container (not individual inputs)
        $(".user-form-fields .form-field").each(function () {
          const $field = $(this);

          // Get the field label
          let label = $field
            .find("label")
            .first()
            .text()
            .replace(" *", "")
            .trim();
          if (!label) return;

          // Determine field type
          const $input = $field.find("input, select, textarea").first();
          if (!$input.length) return;

          const inputType = $input.attr("type");
          const isSelect = $input.is("select");
          const isTextarea =
            $input.is("textarea") && !$field.hasClass("other-field");

          let fieldType;
          if (isSelect) {
            fieldType = "select";
          } else if (isTextarea) {
            fieldType = "textarea";
          } else if ($field.hasClass("other-field")) {
            fieldType = "other";
          } else {
            fieldType = inputType || "text";
          }

          // Handle each field type
          if (fieldType === "checkbox") {
            // Collect all checked checkbox values
            const values = [];
            $field.find('input[type="checkbox"]:checked').each(function () {
              const $checkbox = $(this);
              if ($checkbox.val() === "_other_") {
                const fieldId = $checkbox.data("field-id");
                const otherValue = $(`#${fieldId}_other`).val().trim();
                if (otherValue) values.push(otherValue);
              } else {
                values.push($checkbox.val());
              }
            });
            formData[label] = values.join(", ");
          } else if (fieldType === "radio") {
            // Get checked radio value
            const $checkedRadio = $field.find('input[type="radio"]:checked');
            if ($checkedRadio.length > 0) {
              if ($checkedRadio.val() === "_other_") {
                const fieldId = $checkedRadio.data("field-id");
                formData[label] = $(`#${fieldId}_other`).val().trim() || "";
              } else {
                formData[label] = $checkedRadio.val();
              }
            } else {
              formData[label] = "";
            }
          } else if (fieldType === "select") {
            // Get select value
            const value = $input.val();
            if (value === "_other_") {
              const fieldId = $input.data("field-id");
              formData[label] = $(`#${fieldId}_other`).val().trim() || "";
            } else {
              formData[label] = value || "";
            }
          } else if (fieldType === "other") {
            // Conditional textarea
            const $checkbox = $field.find(".conditional-checkbox-input");
            const $textarea = $field.find(".other-input");
            formData[label] = $checkbox.is(":checked")
              ? $textarea.val().trim()
              : "";
          } else {
            // Text, email, number, tel, date, regular textarea
            formData[label] = $input.val() || "";
          }
        });

        // Convert checkbox arrays to strings
        for (const key in formData) {
          if (Array.isArray(formData[key])) {
            formData[key] = formData[key].join(", ");
          }
        }

        console.log("Simple form data:", formData);

        console.log("Final form data to submit:", formData);

        let sessionId = $('input[name="session_id"]').val();
        if (!sessionId) {
          sessionId = "session_" + Date.now();
        }

        const avatarStudioId = $('input[name="avatar_studio_id"]').val() || 0;

        console.log("Submitting form via AJAX...");
        console.log("Form ID:", currentFormId);
        console.log("Session ID:", sessionId);
        console.log("Avatar Studio ID:", avatarStudioId);

        // Hide form before submission
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

        // Submit via AJAX
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
            $("#nextBtn").prop("disabled", true).text("Submitting...");
            console.log("AJAX request sent with data:", {
              action: "submit_avatar_form",
              form_id: currentFormId,
              session_id: sessionId,
              avatar_studio_id: avatarStudioId,
              form_data: formData,
            });
          },
          success: function (response) {
            console.log("AJAX response received:", response);

            if (response.success) {
              console.log("Form submitted successfully via AJAX");
              console.log("Submission ID:", response.data?.submission_id);

              // Store submission ID in session storage for debugging
              if (response.data?.submission_id) {
                sessionStorage.setItem(
                  "last_submission_id",
                  response.data.submission_id
                );
                console.log(
                  "Stored submission ID in session storage:",
                  response.data.submission_id
                );
              }

              if (instructionEnabled && instructionSectionExists) {
                console.log("Redirecting to instruction section");
                scrollToInstruction();
              } else {
                console.log("Starting session directly");
                startSession();
              }
            } else {
              console.error("Form submission failed:", response.data);
              alert("Error submitting form: " + response.data);

              // Show form again on error
              $("#userform")
                .css({
                  opacity: "1",
                  height: "auto",
                  overflow: "visible",
                  margin: "",
                  padding: "",
                  border: "",
                  visibility: "visible",
                  "pointer-events": "auto",
                  position: "",
                  "z-index": "",
                })
                .show();
            }
          },
          error: function (xhr, status, error) {
            console.error("AJAX error:", error);
            console.error("Status:", status);
            console.error("Response:", xhr.responseText);
            alert("Network error submitting form. Please try again.");

            // Show form again on error
            $("#userform")
              .css({
                opacity: "1",
                height: "auto",
                overflow: "visible",
                margin: "",
                padding: "",
                border: "",
                visibility: "visible",
                "pointer-events": "auto",
                position: "",
                "z-index": "",
              })
              .show();
          },
          complete: function () {
            $("#nextBtn").prop("disabled", false).text("Next");
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
// Function to apply disclaimer styles
function applyDisclaimerStyles(styles) {
  const disclaimerContainer = document.querySelector(".disclaimer-container");
  const disclaimerContent = document.querySelector(".disclaimer-content");
  const disclaimerTitle = document.querySelector(".disclaimer-title");
  const disclaimerBody = document.querySelector(".disclaimer-body");

  if (disclaimerContainer && styles) {
    // Apply container styles
    disclaimerContainer.style.background =
      styles.background || "rgba(0, 0, 0, 0.85)";
    disclaimerContainer.style.opacity = styles.opacity || "0.9";

    // Apply content styles
    if (disclaimerContent) {
      disclaimerContent.style.background =
        styles.content_background || "#ffffff";
      disclaimerContent.style.borderRadius =
        (styles.border_radius || "8") + "px";
    }

    // Apply heading styles
    if (disclaimerTitle) {
      disclaimerTitle.style.color = styles.heading_color || "#ffffff";
      disclaimerTitle.style.fontSize = (styles.heading_size || "20") + "px";
    }

    // Apply body styles
    if (disclaimerBody) {
      disclaimerBody.style.color = styles.content_color || "#f8f9fa";
      disclaimerBody.style.fontSize = (styles.content_size || "14") + "px";
    }
  }
}

// Function to apply instruction styles
function applyInstructionStyles(styles) {
  const instructionContainer = document.querySelector(".instruction-container");
  const instructionContent = document.querySelector(".instruction-content");
  const instructionTitle = document.querySelector(".instruction-title");
  const instructionBody = document.querySelector(".instruction-body");

  if (instructionContainer && styles) {
    // Apply container styles
    instructionContainer.style.background =
      styles.background || "rgba(0, 0, 0, 0.85)";
    instructionContainer.style.opacity = styles.opacity || "0.9";

    // Apply content styles
    if (instructionContent) {
      instructionContent.style.background =
        styles.content_background || "#ffffff";
      instructionContent.style.borderRadius =
        (styles.border_radius || "8") + "px";
    }

    // Apply heading styles
    if (instructionTitle) {
      instructionTitle.style.color = styles.heading_color || "#ffffff";
      instructionTitle.style.fontSize = (styles.heading_size || "20") + "px";
    }

    // Apply body styles
    if (instructionBody) {
      instructionBody.style.color = styles.content_color || "#f8f9fa";
      instructionBody.style.fontSize = (styles.content_size || "14") + "px";
    }
  }
}

// Function to initialize styles when the page loads
function initializeStyles() {
  // Check if avatarStudioConfig exists and has styles
  if (window.avatarStudioConfig && window.avatarStudioConfig.styles) {
    const styles = window.avatarStudioConfig.styles;

    // Apply disclaimer styles if disclaimer is enabled
    if (styles.disclaimer && document.querySelector(".disclaimer-container")) {
      applyDisclaimerStyles(styles.disclaimer);
    }

    // Apply instruction styles if instruction is enabled
    if (
      styles.instruction &&
      document.querySelector(".instruction-container")
    ) {
      applyInstructionStyles(styles.instruction);
    }
  }
}

// Call initializeStyles when the DOM is loaded
document.addEventListener("DOMContentLoaded", initializeStyles);

// Also call it when disclaimer/instruction is shown (if using dynamic loading)
function showDisclaimer() {
  // Apply styles after showing
  if (
    window.avatarStudioConfig &&
    window.avatarStudioConfig.styles &&
    window.avatarStudioConfig.styles.disclaimer
  ) {
    applyDisclaimerStyles(window.avatarStudioConfig.styles.disclaimer);
  }
}

function showInstruction() {
  // Apply styles after showing
  if (
    window.avatarStudioConfig &&
    window.avatarStudioConfig.styles &&
    window.avatarStudioConfig.styles.instruction
  ) {
    applyInstructionStyles(window.avatarStudioConfig.styles.instruction);
  }
}
// Function to apply user form width
function applyUserFormWidth(styles) {
  const userDetailsForm = document.getElementById("userDetailsForm");

  if (userDetailsForm && styles && styles.width) {
    // Apply width to #userDetailsForm
    userDetailsForm.style.width = styles.width;
    userDetailsForm.style.maxWidth = "95%"; // Ensure it doesn't overflow on mobile
    userDetailsForm.style.margin = "0 auto"; // Center it

    // Make it scrollable if content overflows
    userDetailsForm.style.maxHeight = "80vh";
    userDetailsForm.style.overflowY = "auto";
    userDetailsForm.style.overflowX = "hidden";

    // Add smooth scrollbar
    userDetailsForm.style.scrollBehavior = "smooth";
  }
}

// Initialize user form width
function initializeUserFormWidth() {
  if (
    window.avatarStudioConfig &&
    window.avatarStudioConfig.styles &&
    window.avatarStudioConfig.styles.userform
  ) {
    applyUserFormWidth(window.avatarStudioConfig.styles.userform);
  }
}

// Call when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeUserFormWidth();

  // Also apply when user form is shown
  const showUserFormEvent = function () {
    setTimeout(function () {
      if (
        window.avatarStudioConfig &&
        window.avatarStudioConfig.styles &&
        window.avatarStudioConfig.styles.userform
      ) {
        applyUserFormWidth(window.avatarStudioConfig.styles.userform);
      }
    }, 100);
  };

  // Listen for user form show events
  const userFormTriggers = [
    document.getElementById("userform"),
    document.querySelector('[onclick*="userform"]'),
    document.querySelector('[data-action="show-user-form"]'),
  ].filter((el) => el);

  userFormTriggers.forEach((trigger) => {
    trigger.addEventListener("click", showUserFormEvent);
    trigger.addEventListener("show", showUserFormEvent);
  });

  // Also observe for DOM changes in case form is shown dynamically
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style"
      ) {
        const target = mutation.target;
        if (target.id === "userform" && target.style.display !== "none") {
          showUserFormEvent();
        }
      }
    });
  });

  const userFormElement = document.getElementById("userform");
  if (userFormElement) {
    observer.observe(userFormElement, { attributes: true });
  }
});
// Add this to your form frontend JavaScript
$(document).on(
  "change",
  '.conditional-checkbox input[type="checkbox"]',
  function () {
    const $textarea = $(this)
      .closest(".conditional-field-wrapper")
      .find(".other");
    const $textareaInput = $textarea.find("textarea");

    if ($(this).is(":checked")) {
      $textarea.slideDown(300);
      $textareaInput.prop("disabled", false);
      $textareaInput.prop("required", $textareaInput.data("required") || false);
    } else {
      $textarea.slideUp(300);
      $textareaInput.prop("disabled", true);
      $textareaInput.prop("required", false);
      $textareaInput.val(""); // Clear the textarea
    }
  }
);
// When collecting form data for submission
// Updated collectFormData function
function collectFormData() {
  const formData = {};
  $(".user-form-fields .form-field").each(function () {
    const $field = $(this);

    // Get BOTH the field_id and label
    const fieldId = $field.data("field-id"); // ✅ Use this as the key
    const fieldLabel = $field.data("field-label"); // ✅ Keep this for reference

    if (!fieldId) return; // Skip if no field ID

    // Determine field type
    const $input = $field.find("input, select, textarea").first();
    if (!$input.length) return;

    const inputType = $input.attr("type");
    const isSelect = $input.is("select");
    const isTextarea = $input.is("textarea") && !$field.hasClass("other-field");

    let fieldType;
    if (isSelect) {
      fieldType = "select";
    } else if (isTextarea) {
      fieldType = "textarea";
    } else if ($field.hasClass("other-field")) {
      fieldType = "other";
    } else {
      fieldType = inputType || "text";
    }

    // Collect value based on field type
    let fieldValue = "";

    if (fieldType === "checkbox") {
      const values = [];
      $field.find('input[type="checkbox"]:checked').each(function () {
        const $checkbox = $(this);
        if ($checkbox.val() === "_other_") {
          const otherValue = $(`#${fieldId}_other`).val().trim();
          if (otherValue) values.push(otherValue);
        } else {
          values.push($checkbox.val());
        }
      });
      fieldValue = values.join(", ");
    } else if (fieldType === "radio") {
      const $checkedRadio = $field.find('input[type="radio"]:checked');
      if ($checkedRadio.length > 0) {
        if ($checkedRadio.val() === "_other_") {
          fieldValue = $(`#${fieldId}_other`).val().trim() || "";
        } else {
          fieldValue = $checkedRadio.val();
        }
      }
    } else if (fieldType === "select") {
      const value = $input.val();
      if (value === "_other_") {
        fieldValue = $(`#${fieldId}_other`).val().trim() || "";
      } else {
        fieldValue = value || "";
      }
    } else if (fieldType === "other") {
      const $checkbox = $field.find(".conditional-checkbox-input");
      const $textarea = $field.find(".other-input");
      fieldValue = $checkbox.is(":checked") ? $textarea.val().trim() : "";
    } else {
      fieldValue = $input.val() || "";
    }

    // Store with field_id as key, but include label for reference
    formData[fieldId] = {
      value: fieldValue,
      label: fieldLabel, // ✅ Include label for backend reference
    };
  });

  console.log("Form data with field IDs:", formData);
  return formData;
}

// When submitting the form
$("#userDetailsForm").on("submit", function (e) {
  e.preventDefault();

  // Collect form data
  const formData = collectFormData();

  // Submit via AJAX
  $.ajax({
    url: ajaxurl,
    type: "POST",
    data: {
      action: "submit_avatar_form",
      form_id: form_id_to_use,
      session_id: generateSessionId(),
      avatar_studio_id: avatar_studio_id,
      form_data: JSON.stringify(formData),
    },
    success: function (response) {
      if (response.success) {
        // Hide form and proceed to avatar
        $("#userform").hide();
        $("#startSession").show().click();
      } else {
        alert(response.data);
      }
    },
    error: function () {
      alert("Error submitting form. Please try again.");
    },
  });
});
// Conditional Textarea Toggle Handler
function initializeConditionalTextarea() {
  // Handle checkbox change
  $(document).on("change", ".conditional-checkbox-input", function () {
    const $checkbox = $(this);
    const fieldId = $checkbox.attr("id").replace("_checkbox", "");
    const $textareaContainer = $("#" + fieldId + "_textarea_container");
    const $textarea = $("#" + fieldId + "_textarea");
    const isRequired = $textarea.data("required") === "true";

    if ($checkbox.is(":checked")) {
      // Enable and show textarea
      $textareaContainer.slideDown(300, function () {
        $textarea
          .prop("disabled", false)
          .prop("required", isRequired)
          .addClass("slide-in")
          .focus(); // Auto-focus for better UX
      });

      // Add visual feedback
      $checkbox.closest(".conditional-checkbox").addClass("active");
    } else {
      // Disable and hide textarea
      $textareaContainer.slideUp(300, function () {
        $textarea
          .prop("disabled", true)
          .prop("required", false)
          .val("")
          .removeClass("slide-in");
      });

      // Remove visual feedback
      $checkbox.closest(".conditional-checkbox").removeClass("active");
    }
  });

  // Initialize on page load
  $(".conditional-checkbox-input").each(function () {
    const $checkbox = $(this);
    const fieldId = $checkbox.attr("id").replace("_checkbox", "");
    const $textareaContainer = $("#" + fieldId + "_textarea_container");
    const $textarea = $("#" + fieldId + "_textarea");

    if ($checkbox.is(":checked")) {
      $textareaContainer.show();
      $textarea.prop("disabled", false);
      if ($textarea.data("required") === "true") {
        $textarea.prop("required", true);
      }
      $checkbox.closest(".conditional-checkbox").addClass("active");
    }
  });

  // Add form validation
  $(document).on("submit", "#userDetailsForm", function (e) {
    let hasError = false;
    let errorMessage = "";

    $(".conditional-checkbox-input:checked").each(function () {
      const $checkbox = $(this);
      const fieldId = $checkbox.attr("id").replace("_checkbox", "");
      const $textarea = $("#" + fieldId + "_textarea");
      const fieldLabel = $checkbox
        .closest(".conditional-field-wrapper")
        .prev(".field-main-label")
        .text()
        .trim();

      // Check if textarea is required but empty
      if (
        $textarea.data("required") === "true" &&
        $.trim($textarea.val()) === ""
      ) {
        hasError = true;
        errorMessage = "Please fill in the required field: " + fieldLabel;

        // Add error styling
        $textarea.addClass("error").focus();

        // Show error message
        if (!$textarea.next(".error-message").length) {
          $textarea.after(
            '<div class="error-message" style="color: #dc2626; font-size: 12px; margin-top: 5px;">This field is required</div>'
          );
        }

        return false; // Break out of loop
      }
    });

    if (hasError) {
      e.preventDefault();
      alert(errorMessage);
      return false;
    }
  });

  // Remove error styling when user starts typing
  $(document).on("input", ".other-input.error", function () {
    $(this).removeClass("error");
    $(this).next(".error-message").remove();
  });
}

// Initialize when document is ready
$(document).ready(function () {
  initializeConditionalTextarea();

  // Re-initialize when user form modal opens
  if (
    typeof avatarStudioConfig !== "undefined" &&
    avatarStudioConfig.user_form_enable
  ) {
    // Wait a bit for the form to be rendered
    setTimeout(initializeConditionalTextarea, 500);
  }
});
// Function to handle "Other" option selection
function initializeOtherOptionHandlers() {
  // For dropdowns
  $(document).on("change", "select.has-other-option", function () {
    const $select = $(this);
    const fieldId = $select.data("field-id");
    const $otherWrapper = $("#" + fieldId + "_other_wrapper");
    const $otherInput = $("#" + fieldId + "_other");

    if ($select.val() === "_other_") {
      $otherWrapper.slideDown(300);
      $otherInput.prop("disabled", false);
      $otherInput.focus();
    } else {
      $otherWrapper.slideUp(300);
      $otherInput.prop("disabled", true);
      $otherInput.val("");
    }
  });

  // For radio buttons
  $(document).on("change", 'input[type="radio"].has-other-option', function () {
    const $radio = $(this);
    const fieldId = $radio.data("field-id");
    const $otherWrapper = $("#" + fieldId + "_other_wrapper");
    const $otherInput = $("#" + fieldId + "_other");

    if ($radio.val() === "_other_") {
      $otherWrapper.slideDown(300);
      $otherInput.prop("disabled", false);
      $otherInput.focus();
    } else {
      $otherWrapper.slideUp(300);
      $otherInput.prop("disabled", true);
      $otherInput.val("");
    }
  });

  // For checkboxes
  $(document).on(
    "change",
    'input[type="checkbox"].has-other-option',
    function () {
      const $checkbox = $(this);
      const fieldId = $checkbox.data("field-id");
      const $otherWrapper = $("#" + fieldId + "_other_wrapper");
      const $otherInput = $("#" + fieldId + "_other");

      if ($checkbox.val() === "_other_" && $checkbox.is(":checked")) {
        $otherWrapper.slideDown(300);
        $otherInput.prop("disabled", false);
        $otherInput.focus();
      } else if ($checkbox.val() === "_other_" && !$checkbox.is(":checked")) {
        $otherWrapper.slideUp(300);
        $otherInput.prop("disabled", true);
        $otherInput.val("");
      }
    }
  );

  // Initialize on page load
  $("select.has-other-option").each(function () {
    if ($(this).val() === "_other_") {
      const fieldId = $(this).data("field-id");
      $("#" + fieldId + "_other_wrapper").show();
      $("#" + fieldId + "_other").prop("disabled", false);
    }
  });

  $('input[type="radio"].has-other-option:checked').each(function () {
    if ($(this).val() === "_other_") {
      const fieldId = $(this).data("field-id");
      $("#" + fieldId + "_other_wrapper").show();
      $("#" + fieldId + "_other").prop("disabled", false);
    }
  });

  $('input[type="checkbox"].has-other-option:checked').each(function () {
    if ($(this).val() === "_other_") {
      const fieldId = $(this).data("field-id");
      $("#" + fieldId + "_other_wrapper").show();
      $("#" + fieldId + "_other").prop("disabled", false);
    }
  });
}

// Call this function when the form is loaded
$(document).ready(function () {
  initializeOtherOptionHandlers();
});
