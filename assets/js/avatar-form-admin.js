// admin-avatar-form.js
document.addEventListener("DOMContentLoaded", function () {
  // Copy shortcode functionality for form pages
  const copyBtns = document.querySelectorAll(".copy-shortcode-btn");
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const shortcode = this.dataset.shortcode;

      // Create temporary input
      const tempInput = document.createElement("input");
      document.body.appendChild(tempInput);
      tempInput.value = shortcode;
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      // Visual feedback
      const originalText = this.textContent;
      this.textContent = "Copied!";
      setTimeout(function () {
        btn.textContent = originalText;
      }, 2000);
    });
  });

  // Toast messages functionality
  setupToastMessages();

  // Custom headers functionality
  setupCustomHeaders();

  // Thumbnail preview functionality
  setupThumbnailPreview();

  // Instruction video functionality
  setupInstructionVideo();

  // Show/hide functionality based on vendor
  setupVendorSpecificFields();
});

function setupToastMessages() {
  const toastMessagesContainer = document.getElementById(
    "toast-messages-container"
  );
  const addToastBtn = document.getElementById("add-toast-btn");

  if (!toastMessagesContainer || !addToastBtn) return;

  // Add new toast message
  addToastBtn.addEventListener("click", function () {
    const toastCount =
      toastMessagesContainer.querySelectorAll(".toast-message-row").length;
    const template = document.getElementById("toast-message-template");
    if (!template) return;

    const clone = template.content.cloneNode(true);
    const inputs = clone.querySelectorAll("input, select");
    inputs.forEach((input) => {
      const name = input.name.replace(
        "toast_messages[0]",
        `toast_messages[${toastCount}]`
      );
      input.name = name;
    });

    // Add remove button
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "button button-small remove-toast-btn";
    removeBtn.textContent = "Remove";
    removeBtn.style.marginLeft = "10px";
    removeBtn.addEventListener("click", function () {
      const row = this.closest(".toast-message-row");
      if (row) {
        row.remove();
      }
    });

    const controlsDiv = clone.querySelector(".toast-controls");
    if (controlsDiv) {
      controlsDiv.appendChild(removeBtn);
    }

    toastMessagesContainer.appendChild(clone);
  });

  // Remove toast messages
  toastMessagesContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-toast-btn")) {
      const row = e.target.closest(".toast-message-row");
      if (row) {
        row.remove();
      }
    }
  });
}

function setupCustomHeaders() {
  const headersContainer = document.getElementById("headers-container");
  const addHeaderBtn = document.getElementById("add-header-btn");

  if (!headersContainer || !addHeaderBtn) return;

  // Add new header
  addHeaderBtn.addEventListener("click", function () {
    const headerCount = headersContainer.querySelectorAll(".header-row").length;
    const template = document.getElementById("header-template");
    if (!template) return;

    const clone = template.content.cloneNode(true);
    const inputs = clone.querySelectorAll("input");
    inputs.forEach((input) => {
      const name = input.name.replace("headers[0]", `headers[${headerCount}]`);
      input.name = name;
    });

    // Add remove button
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "button button-small remove-header-btn";
    removeBtn.textContent = "Remove";
    removeBtn.style.marginLeft = "10px";
    removeBtn.addEventListener("click", function () {
      const row = this.closest(".header-row");
      if (row) {
        row.remove();
      }
    });

    const controlsDiv = clone.querySelector(".header-controls");
    if (controlsDiv) {
      controlsDiv.appendChild(removeBtn);
    }

    headersContainer.appendChild(clone);
  });

  // Remove headers
  headersContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-header-btn")) {
      const row = e.target.closest(".header-row");
      if (row) {
        row.remove();
      }
    }
  });
}

function setupThumbnailPreview() {
  const thumbnailInputs = document.querySelectorAll(
    'input[name^="thumbnail_"]'
  );
  const previewContainer = document.getElementById(
    "thumbnail-preview-container"
  );
  const activeThumbnailInput = document.querySelector(
    'input[name="active_thumbnail"]:checked'
  );

  if (!thumbnailInputs.length || !previewContainer) return;

  // Update preview when thumbnail URL changes
  thumbnailInputs.forEach((input) => {
    input.addEventListener("input", updateThumbnailPreview);
  });

  // Update preview when active thumbnail changes
  const activeThumbnailRadios = document.querySelectorAll(
    'input[name="active_thumbnail"]'
  );
  activeThumbnailRadios.forEach((radio) => {
    radio.addEventListener("change", updateThumbnailPreview);
  });

  function updateThumbnailPreview() {
    const activeThumbnail = document.querySelector(
      'input[name="active_thumbnail"]:checked'
    ).value;
    const urlInput = document.querySelector(
      `input[name="thumbnail_${activeThumbnail}"]`
    );
    const previewImg = previewContainer.querySelector("img");

    if (urlInput && urlInput.value) {
      previewImg.src = urlInput.value;
      previewImg.style.display = "block";
      previewContainer.style.background = "none";
    } else {
      previewImg.style.display = "none";
      previewContainer.style.background = "#f3f4f6";
    }
  }

  // Initial preview
  updateThumbnailPreview();
}

function setupInstructionVideo() {
  const instructionEnable = document.getElementById("instruction_enable");
  const instructionSection = document.getElementById("instruction-section");
  const skipInstructionVideo = document.getElementById(
    "skip_instruction_video"
  );

  if (instructionEnable && instructionSection) {
    // Toggle instruction section
    instructionEnable.addEventListener("change", function () {
      instructionSection.style.display = this.checked ? "block" : "none";
    });

    // Initial state
    instructionSection.style.display = instructionEnable.checked
      ? "block"
      : "none";
  }

  if (skipInstructionVideo) {
    skipInstructionVideo.addEventListener("change", function () {
      const videoInput = document.getElementById("instruction_video_url");
      if (videoInput) {
        videoInput.disabled = this.checked;
      }
    });
  }
}

function setupVendorSpecificFields() {
  const vendorInputs = document.querySelectorAll('input[name="vendor"]');

  if (!vendorInputs.length) return;

  function updateVendorFields() {
    const vendor = document.querySelector('input[name="vendor"]:checked').value;
    const tavusFields = document.querySelectorAll(".tavus-field");
    const heygenFields = document.querySelectorAll(".heygen-field");

    // Hide all vendor-specific fields first
    tavusFields.forEach((field) => (field.style.display = "none"));
    heygenFields.forEach((field) => (field.style.display = "none"));

    // Show fields for selected vendor
    if (vendor === "tavus") {
      tavusFields.forEach((field) => (field.style.display = "block"));
    } else if (vendor === "heygen") {
      heygenFields.forEach((field) => (field.style.display = "block"));
    }
  }

  // Listen for vendor changes
  vendorInputs.forEach((input) => {
    input.addEventListener("change", updateVendorFields);
  });

  // Initial update
  updateVendorFields();
}
(function ($) {
  "use strict";

  // Global variables
  let plugin_dir_url = avatarFormAdmin.plugin_dir_url;
  let frame;
  let imageUploaderWrap;

  // Helper function to check if value is numeric
  function isNumeric(value) {
    return value !== "" && value !== null && !isNaN(value) && isFinite(value);
  }

  // Clear color picker function
  window.clearLCColorPicker = function (clearBtn) {
    const container = clearBtn.closest(".input-with-clear");
    const input = container.querySelector("input");
    const wrapper = input.closest("[data-for]");
    const preview = wrapper.querySelector(".lccp-preview");

    input.value = "";
    if (preview) {
      preview.style.background = "transparent";
    }

    const event = new Event("change", { bubbles: true });
    input.dispatchEvent(event);
    clearBtn.style.display = "none";
  };

  // Show chat box preview function
  function showChatBoxPreview(event) {
    if (event) {
      const container = event.target.closest(".input-controls");
      if (container) {
        const clearBtn = container.querySelector(".clear-btn");
        if (clearBtn) {
          clearBtn.style.display = event.target.value != "" ? "block" : "none";
        }
      }
    }

    const previewArea = document.getElementById("chatBox-preview-area");
    const previewImage = document.getElementById("previewImage");
    const avatarVideo = document.getElementById("avatarVideo");
    const chatBox = document.getElementById("chatBox");
    const chatBoxHeading = document.getElementById("chatBox-heading");
    const startSession = document.getElementById("startSession");
    const endSession = document.getElementById("endSession");
    const micToggler = document.getElementById("micToggler");
    const switchInteractionMode = document.getElementById(
      "switchInteractionMode"
    );
    const transcriptToggleButton = document.getElementsByClassName(
      "transcriptToggleButton"
    );

    const avatar_title = document.getElementById("avatar_title").value.trim();
    const preview_image = document.getElementById("preview_image").value.trim();

    if (previewImage) {
      previewImage.src = preview_image || avatarFormAdmin.previewImage;
    }
    if (avatarVideo) {
      avatarVideo.setAttribute(
        "poster",
        preview_image || avatarFormAdmin.previewImage
      );
    }

    const chatBoxStyleEl = document.getElementById("chatBox-style");

    // Chat Box Styles
    if (chatBox) {
      var chatBoxEl = chatBoxStyleEl.querySelector(".chatBox");
      var width = chatBoxEl.querySelector(".width").value.trim();
      var height = chatBoxEl.querySelector(".height").value.trim();
      var bg = chatBoxEl.querySelector(".background").value.trim();
      var borderWidth = chatBoxEl.querySelector(".border-width").value.trim();
      var borderStyle = chatBoxEl.querySelector(".border-style").value.trim();
      var borderColor = chatBoxEl.querySelector(".border-color").value.trim();
      var borderRadiusLeft = chatBoxEl
        .querySelector(".border-radius-left")
        .value.trim();
      var borderRadiusTop = chatBoxEl
        .querySelector(".border-radius-top")
        .value.trim();
      var borderRadiusRight = chatBoxEl
        .querySelector(".border-radius-right")
        .value.trim();
      var borderRadiusBottom = chatBoxEl
        .querySelector(".border-radius-bottom")
        .value.trim();
      var paddingLeft = chatBoxEl.querySelector(".padding-left").value.trim();
      var paddingTop = chatBoxEl.querySelector(".padding-top").value.trim();
      var paddingRight = chatBoxEl.querySelector(".padding-right").value.trim();
      var paddingBottom = chatBoxEl
        .querySelector(".padding-bottom")
        .value.trim();

      if (width && width != "") {
        chatBox.style.setProperty(
          "width",
          isNumeric(width) ? `${width}px` : width || "550px",
          "important"
        );
      } else {
        chatBox.style.removeProperty("width");
      }
      if (height && height != "") {
        chatBox.style.setProperty(
          "height",
          isNumeric(height) ? `${height}px` : height || "360px",
          "important"
        );
      } else {
        chatBox.style.removeProperty("height");
      }
      if (bg && bg != "") {
        chatBox.style.setProperty("background", `${bg}`, "important");
      } else {
        chatBox.style.removeProperty("background");
      }
      if (borderWidth && borderWidth >= 0) {
        chatBox.style.setProperty(
          "border",
          `${borderWidth || 0}px ${borderStyle || "solid"} ${
            borderColor || "transparent"
          }`,
          "important"
        );
      } else {
        chatBox.style.removeProperty("border");
      }
      if (
        [
          borderRadiusTop,
          borderRadiusRight,
          borderRadiusBottom,
          borderRadiusLeft,
        ].some((p) => isNumeric(p) && Number(p) >= 0)
      ) {
        chatBox.style.setProperty(
          "border-radius",
          `${borderRadiusTop || 0}px ${borderRadiusRight || 0}px ${
            borderRadiusBottom || 0
          }px ${borderRadiusLeft || 0}px`,
          "important"
        );
      } else {
        chatBox.style.removeProperty("border-radius");
      }
      if (
        [paddingTop, paddingRight, paddingBottom, paddingLeft].some(
          (p) => isNumeric(p) && Number(p) >= 0
        )
      ) {
        chatBox.style.setProperty(
          "padding",
          `${paddingTop || 0}px ${paddingRight || 0}px ${
            paddingBottom || 0
          }px ${paddingLeft || 0}px`,
          "important"
        );
      } else {
        chatBox.style.removeProperty("padding");
      }
    }

    // Heading Styles
    if (chatBoxHeading) {
      var headingEl = chatBoxStyleEl.querySelector(".heading");
      var bg = headingEl.querySelector(".background").value.trim();
      var textColor = headingEl.querySelector(".color").value.trim();
      var position = headingEl.querySelector(".position").value.trim();
      var borderWidth = headingEl.querySelector(".border-width").value.trim();
      var borderStyle = headingEl.querySelector(".border-style").value.trim();
      var borderColor = headingEl.querySelector(".border-color").value.trim();
      var textAlign = headingEl.querySelector(".text-align").value.trim();
      var fontSize = headingEl.querySelector(".font-size").value.trim();
      var lineHeight = headingEl.querySelector(".line-height").value.trim();
      var borderRadiusLeft = headingEl
        .querySelector(".border-radius-left")
        .value.trim();
      var borderRadiusTop = headingEl
        .querySelector(".border-radius-top")
        .value.trim();
      var borderRadiusRight = headingEl
        .querySelector(".border-radius-right")
        .value.trim();
      var borderRadiusBottom = headingEl
        .querySelector(".border-radius-bottom")
        .value.trim();
      var paddingLeft = headingEl.querySelector(".padding-left").value.trim();
      var paddingTop = headingEl.querySelector(".padding-top").value.trim();
      var paddingRight = headingEl.querySelector(".padding-right").value.trim();
      var paddingBottom = headingEl
        .querySelector(".padding-bottom")
        .value.trim();

      chatBoxHeading.textContent = avatar_title || "";
      chatBoxHeading.style.setProperty(
        "position",
        `${position || "relative"}`,
        "important"
      );
      if (bg && bg != "") {
        chatBoxHeading.style.setProperty("background", `${bg}`, "important");
      } else {
        chatBoxHeading.style.removeProperty("background");
      }
      if (borderWidth && borderWidth >= 0) {
        chatBoxHeading.style.setProperty(
          "border",
          `${borderWidth || 0}px ${borderStyle || "solid"} ${
            borderColor || "transparent"
          }`,
          "important"
        );
      } else {
        chatBoxHeading.style.removeProperty("border");
      }
      if (
        [
          borderRadiusTop,
          borderRadiusRight,
          borderRadiusBottom,
          borderRadiusLeft,
        ].some((p) => isNumeric(p) && Number(p) >= 0)
      ) {
        chatBoxHeading.style.setProperty(
          "border-radius",
          `${borderRadiusTop || 0}px ${borderRadiusRight || 0}px ${
            borderRadiusBottom || 0
          }px ${borderRadiusLeft || 0}px`,
          "important"
        );
      } else {
        chatBoxHeading.style.removeProperty("border-radius");
      }
      if (
        [paddingTop, paddingRight, paddingBottom, paddingLeft].some(
          (p) => isNumeric(p) && Number(p) >= 0
        )
      ) {
        chatBoxHeading.style.setProperty(
          "padding",
          `${paddingTop || 0}px ${paddingRight || 0}px ${
            paddingBottom || 0
          }px ${paddingLeft || 0}px`,
          "important"
        );
      } else {
        chatBoxHeading.style.removeProperty("padding");
      }
      if (textColor && textColor != "") {
        chatBoxHeading.style.setProperty("color", `${textColor}`, "important");
      } else {
        chatBoxHeading.style.removeProperty("color");
      }
      if (textAlign && textAlign != "") {
        chatBoxHeading.style.setProperty(
          "text-align",
          `${textAlign || "left"}`,
          "important"
        );
      } else {
        chatBoxHeading.style.removeProperty("text-align");
      }
      if (fontSize && fontSize != "") {
        chatBoxHeading.style.setProperty(
          "font-size",
          `${fontSize || 14}px`,
          "important"
        );
      } else {
        chatBoxHeading.style.removeProperty("font-size");
      }
      if (lineHeight && lineHeight != "") {
        chatBoxHeading.style.setProperty(
          "line-height",
          `${lineHeight || 18}px`,
          "important"
        );
      } else {
        chatBoxHeading.style.removeProperty("line-height");
      }
    }

    // Chat Start Button Styles
    if (startSession) {
      var chatStartButtonEl =
        chatBoxStyleEl.querySelector(".chat-start-button");
      var bg = chatStartButtonEl.querySelector(".background").value.trim();
      var textColor = chatStartButtonEl.querySelector(".color").value.trim();
      var borderWidth = chatStartButtonEl
        .querySelector(".border-width")
        .value.trim();
      var borderStyle = chatStartButtonEl
        .querySelector(".border-style")
        .value.trim();
      var borderColor = chatStartButtonEl
        .querySelector(".border-color")
        .value.trim();
      var textAlign = chatStartButtonEl
        .querySelector(".text-align")
        .value.trim();
      var fontSize = chatStartButtonEl.querySelector(".font-size").value.trim();
      var lineHeight = chatStartButtonEl
        .querySelector(".line-height")
        .value.trim();
      var borderRadiusLeft = chatStartButtonEl
        .querySelector(".border-radius-left")
        .value.trim();
      var borderRadiusTop = chatStartButtonEl
        .querySelector(".border-radius-top")
        .value.trim();
      var borderRadiusRight = chatStartButtonEl
        .querySelector(".border-radius-right")
        .value.trim();
      var borderRadiusBottom = chatStartButtonEl
        .querySelector(".border-radius-bottom")
        .value.trim();
      var paddingLeft = chatStartButtonEl
        .querySelector(".padding-left")
        .value.trim();
      var paddingTop = chatStartButtonEl
        .querySelector(".padding-top")
        .value.trim();
      var paddingRight = chatStartButtonEl
        .querySelector(".padding-right")
        .value.trim();
      var paddingBottom = chatStartButtonEl
        .querySelector(".padding-bottom")
        .value.trim();

      if (bg && bg != "") {
        startSession.style.setProperty("background", `${bg}`, "important");
      } else {
        startSession.style.removeProperty("background");
      }
      if (borderWidth && borderWidth >= 0) {
        startSession.style.setProperty(
          "border",
          `${borderWidth || 0}px ${borderStyle || "solid"} ${
            borderColor || "transparent"
          }`,
          "important"
        );
      } else {
        startSession.style.removeProperty("border");
      }
      if (
        [
          borderRadiusTop,
          borderRadiusRight,
          borderRadiusBottom,
          borderRadiusLeft,
        ].some((p) => isNumeric(p) && Number(p) >= 0)
      ) {
        startSession.style.setProperty(
          "border-radius",
          `${borderRadiusTop || 0}px ${borderRadiusRight || 0}px ${
            borderRadiusBottom || 0
          }px ${borderRadiusLeft || 0}px`,
          "important"
        );
      } else {
        startSession.style.removeProperty("border-radius");
      }
      if (
        [paddingTop, paddingRight, paddingBottom, paddingLeft].some(
          (p) => isNumeric(p) && Number(p) >= 0
        )
      ) {
        startSession.style.setProperty(
          "padding",
          `${paddingTop || 0}px ${paddingRight || 0}px ${
            paddingBottom || 0
          }px ${paddingLeft || 0}px`,
          "important"
        );
      } else {
        startSession.style.removeProperty("padding");
      }
      if (textColor && textColor != "") {
        startSession.style.setProperty("color", `${textColor}`, "important");
      } else {
        startSession.style.removeProperty("color");
      }
      if (textAlign && textAlign != "") {
        startSession.style.setProperty(
          "text-align",
          `${textAlign || "left"}`,
          "important"
        );
      } else {
        startSession.style.removeProperty("text-align");
      }
      if (fontSize && fontSize != "") {
        startSession.style.setProperty(
          "font-size",
          `${fontSize || 14}px`,
          "important"
        );
      } else {
        startSession.style.removeProperty("font-size");
      }
      if (lineHeight && lineHeight != "") {
        startSession.style.setProperty(
          "line-height",
          `${lineHeight || 18}px`,
          "important"
        );
      } else {
        startSession.style.removeProperty("line-height");
      }
    }

    // Switch Interaction Mode Button Styles
    if (document.getElementById("switchInteractionMode")) {
      var switchButtonEl = chatBoxStyleEl.querySelector(".switch-button");

      if (switchButtonEl) {
        var bg = switchButtonEl.querySelector(".background")?.value.trim();
        var textColor = switchButtonEl.querySelector(".color")?.value.trim();
        var borderWidth = switchButtonEl
          .querySelector(".border-width")
          ?.value.trim();
        var borderStyle = switchButtonEl
          .querySelector(".border-style")
          ?.value.trim();
        var borderColor = switchButtonEl
          .querySelector(".border-color")
          ?.value.trim();
        var textAlign = switchButtonEl
          .querySelector(".text-align")
          ?.value.trim();
        var fontSize = switchButtonEl.querySelector(".font-size")?.value.trim();
        var lineHeight = switchButtonEl
          .querySelector(".line-height")
          ?.value.trim();
        var borderRadiusLeft = switchButtonEl
          .querySelector(".border-radius-left")
          ?.value.trim();
        var borderRadiusTop = switchButtonEl
          .querySelector(".border-radius-top")
          ?.value.trim();
        var borderRadiusRight = switchButtonEl
          .querySelector(".border-radius-right")
          ?.value.trim();
        var borderRadiusBottom = switchButtonEl
          .querySelector(".border-radius-bottom")
          ?.value.trim();
        var paddingLeft = switchButtonEl
          .querySelector(".padding-left")
          ?.value.trim();
        var paddingTop = switchButtonEl
          .querySelector(".padding-top")
          ?.value.trim();
        var paddingRight = switchButtonEl
          .querySelector(".padding-right")
          ?.value.trim();
        var paddingBottom = switchButtonEl
          .querySelector(".padding-bottom")
          ?.value.trim();

        const switchBtn = document.getElementById("switchInteractionMode");

        if (bg && bg != "") {
          switchBtn.style.setProperty("background", `${bg}`, "important");
        } else {
          switchBtn.style.removeProperty("background");
        }
        if (borderWidth && borderWidth >= 0) {
          switchBtn.style.setProperty(
            "border",
            `${borderWidth || 0}px ${borderStyle || "solid"} ${
              borderColor || "transparent"
            }`,
            "important"
          );
        } else {
          switchBtn.style.removeProperty("border");
        }
        if (
          [
            borderRadiusTop,
            borderRadiusRight,
            borderRadiusBottom,
            borderRadiusLeft,
          ].some((p) => isNumeric(p) && Number(p) >= 0)
        ) {
          switchBtn.style.setProperty(
            "border-radius",
            `${borderRadiusTop || 0}px ${borderRadiusRight || 0}px ${
              borderRadiusBottom || 0
            }px ${borderRadiusLeft || 0}px`,
            "important"
          );
        } else {
          switchBtn.style.removeProperty("border-radius");
        }
        if (
          [paddingTop, paddingRight, paddingBottom, paddingLeft].some(
            (p) => isNumeric(p) && Number(p) >= 0
          )
        ) {
          switchBtn.style.setProperty(
            "padding",
            `${paddingTop || 0}px ${paddingRight || 0}px ${
              paddingBottom || 0
            }px ${paddingLeft || 0}px`,
            "important"
          );
        } else {
          switchBtn.style.removeProperty("padding");
        }
        if (textColor && textColor != "") {
          switchBtn.style.setProperty("color", `${textColor}`, "important");
        } else {
          switchBtn.style.removeProperty("color");
        }
        if (textAlign && textAlign != "") {
          switchBtn.style.setProperty(
            "text-align",
            `${textAlign || "center"}`,
            "important"
          );
        } else {
          switchBtn.style.removeProperty("text-align");
        }
        if (fontSize && fontSize != "") {
          switchBtn.style.setProperty(
            "font-size",
            `${fontSize || 14}px`,
            "important"
          );
        } else {
          switchBtn.style.removeProperty("font-size");
        }
        if (lineHeight && lineHeight != "") {
          switchBtn.style.setProperty(
            "line-height",
            `${lineHeight || 18}px`,
            "important"
          );
        } else {
          switchBtn.style.removeProperty("line-height");
        }
      }
    }

    // Camera Button Styles
    if (document.getElementById("cameraToggler")) {
      var cameraButtonEl = chatBoxStyleEl.querySelector(".camera-button");

      if (cameraButtonEl) {
        var bg = cameraButtonEl.querySelector(".background")?.value.trim();
        var textColor = cameraButtonEl.querySelector(".color")?.value.trim();
        var borderWidth = cameraButtonEl
          .querySelector(".border-width")
          ?.value.trim();
        var borderStyle = cameraButtonEl
          .querySelector(".border-style")
          ?.value.trim();
        var borderColor = cameraButtonEl
          .querySelector(".border-color")
          ?.value.trim();
        var textAlign = cameraButtonEl
          .querySelector(".text-align")
          ?.value.trim();
        var fontSize = cameraButtonEl.querySelector(".font-size")?.value.trim();
        var lineHeight = cameraButtonEl
          .querySelector(".line-height")
          ?.value.trim();
        var borderRadiusLeft = cameraButtonEl
          .querySelector(".border-radius-left")
          ?.value.trim();
        var borderRadiusTop = cameraButtonEl
          .querySelector(".border-radius-top")
          ?.value.trim();
        var borderRadiusRight = cameraButtonEl
          .querySelector(".border-radius-right")
          ?.value.trim();
        var borderRadiusBottom = cameraButtonEl
          .querySelector(".border-radius-bottom")
          ?.value.trim();
        var paddingLeft = cameraButtonEl
          .querySelector(".padding-left")
          ?.value.trim();
        var paddingTop = cameraButtonEl
          .querySelector(".padding-top")
          ?.value.trim();
        var paddingRight = cameraButtonEl
          .querySelector(".padding-right")
          ?.value.trim();
        var paddingBottom = cameraButtonEl
          .querySelector(".padding-bottom")
          ?.value.trim();

        const cameraBtn = document.getElementById("cameraToggler");

        if (bg && bg != "") {
          cameraBtn.style.setProperty("background", `${bg}`, "important");
        } else {
          cameraBtn.style.setProperty(
            "background",
            "rgba(239, 68, 68, 0.5)",
            "important"
          );
        }
        if (borderWidth && borderWidth >= 0) {
          cameraBtn.style.setProperty(
            "border",
            `${borderWidth || 0}px ${borderStyle || "solid"} ${
              borderColor || "transparent"
            }`,
            "important"
          );
        } else {
          cameraBtn.style.removeProperty("border");
        }
        if (
          [
            borderRadiusTop,
            borderRadiusRight,
            borderRadiusBottom,
            borderRadiusLeft,
          ].some((p) => isNumeric(p) && Number(p) >= 0)
        ) {
          cameraBtn.style.setProperty(
            "border-radius",
            `${borderRadiusTop || 0}px ${borderRadiusRight || 0}px ${
              borderRadiusBottom || 0
            }px ${borderRadiusLeft || 0}px`,
            "important"
          );
        } else {
          cameraBtn.style.removeProperty("border-radius");
        }
        if (
          [paddingTop, paddingRight, paddingBottom, paddingLeft].some(
            (p) => isNumeric(p) && Number(p) >= 0
          )
        ) {
          cameraBtn.style.setProperty(
            "padding",
            `${paddingTop || 0}px ${paddingRight || 0}px ${
              paddingBottom || 0
            }px ${paddingLeft || 0}px`,
            "important"
          );
        } else {
          cameraBtn.style.removeProperty("padding");
        }
        if (textColor && textColor != "") {
          cameraBtn.style.setProperty("color", `${textColor}`, "important");
          const cameraIcon = cameraBtn.querySelector("#cameraIcon");
          if (cameraIcon) {
            cameraIcon.style.setProperty("color", `${textColor}`, "important");
          }
        } else {
          cameraBtn.style.setProperty("color", "#FFFFFF", "important");
          const cameraIcon = cameraBtn.querySelector("#cameraIcon");
          if (cameraIcon) {
            cameraIcon.style.setProperty("color", "#FFFFFF", "important");
          }
        }
        if (textAlign && textAlign != "") {
          cameraBtn.style.setProperty(
            "text-align",
            `${textAlign || "center"}`,
            "important"
          );
        } else {
          cameraBtn.style.removeProperty("text-align");
        }
        if (fontSize && fontSize != "") {
          cameraBtn.style.setProperty(
            "font-size",
            `${fontSize || 14}px`,
            "important"
          );
          const cameraIcon = cameraBtn.querySelector("#cameraIcon");
          if (cameraIcon) {
            cameraIcon.style.setProperty(
              "font-size",
              `${fontSize || 14}px`,
              "important"
            );
          }
        } else {
          cameraBtn.style.removeProperty("font-size");
        }
        if (lineHeight && lineHeight != "") {
          cameraBtn.style.setProperty(
            "line-height",
            `${lineHeight || 18}px`,
            "important"
          );
        } else {
          cameraBtn.style.removeProperty("line-height");
        }
      }
    }

    // Chat End Button Styles
    if (endSession) {
      var chatEndButtonEl = chatBoxStyleEl.querySelector(".chat-end-button");
      var bg = chatEndButtonEl.querySelector(".background").value.trim();
      var textColor = chatEndButtonEl.querySelector(".color").value.trim();
      var borderWidth = chatEndButtonEl
        .querySelector(".border-width")
        .value.trim();
      var borderStyle = chatEndButtonEl
        .querySelector(".border-style")
        .value.trim();
      var borderColor = chatEndButtonEl
        .querySelector(".border-color")
        .value.trim();
      var textAlign = chatEndButtonEl.querySelector(".text-align").value.trim();
      var fontSize = chatEndButtonEl.querySelector(".font-size").value.trim();
      var lineHeight = chatEndButtonEl
        .querySelector(".line-height")
        .value.trim();
      var borderRadiusLeft = chatEndButtonEl
        .querySelector(".border-radius-left")
        .value.trim();
      var borderRadiusTop = chatEndButtonEl
        .querySelector(".border-radius-top")
        .value.trim();
      var borderRadiusRight = chatEndButtonEl
        .querySelector(".border-radius-right")
        .value.trim();
      var borderRadiusBottom = chatEndButtonEl
        .querySelector(".border-radius-bottom")
        .value.trim();
      var paddingLeft = chatEndButtonEl
        .querySelector(".padding-left")
        .value.trim();
      var paddingTop = chatEndButtonEl
        .querySelector(".padding-top")
        .value.trim();
      var paddingRight = chatEndButtonEl
        .querySelector(".padding-right")
        .value.trim();
      var paddingBottom = chatEndButtonEl
        .querySelector(".padding-bottom")
        .value.trim();

      if (bg && bg != "") {
        endSession.style.setProperty("background", `${bg}`, "important");
      } else {
        endSession.style.removeProperty("background");
      }
      if (borderWidth && borderWidth >= 0) {
        endSession.style.setProperty(
          "border",
          `${borderWidth || 0}px ${borderStyle || "solid"} ${
            borderColor || "transparent"
          }`,
          "important"
        );
      } else {
        endSession.style.removeProperty("border");
      }
      if (
        [
          borderRadiusTop,
          borderRadiusRight,
          borderRadiusBottom,
          borderRadiusLeft,
        ].some((p) => isNumeric(p) && Number(p) >= 0)
      ) {
        endSession.style.setProperty(
          "border-radius",
          `${borderRadiusTop || 0}px ${borderRadiusRight || 0}px ${
            borderRadiusBottom || 0
          }px ${borderRadiusLeft || 0}px`,
          "important"
        );
      } else {
        endSession.style.removeProperty("border-radius");
      }
      if (
        [paddingTop, paddingRight, paddingBottom, paddingLeft].some(
          (p) => isNumeric(p) && Number(p) >= 0
        )
      ) {
        endSession.style.setProperty(
          "padding",
          `${paddingTop || 0}px ${paddingRight || 0}px ${
            paddingBottom || 0
          }px ${paddingLeft || 0}px`,
          "important"
        );
      } else {
        endSession.style.removeProperty("padding");
      }
      if (textColor && textColor != "") {
        endSession.style.setProperty("color", `${textColor}`, "important");
      } else {
        endSession.style.removeProperty("color");
      }
      if (textAlign && textAlign != "") {
        endSession.style.setProperty(
          "text-align",
          `${textAlign || "left"}`,
          "important"
        );
      } else {
        endSession.style.removeProperty("text-align");
      }
      if (fontSize && fontSize != "") {
        endSession.style.setProperty(
          "font-size",
          `${fontSize || 14}px`,
          "important"
        );
      } else {
        endSession.style.removeProperty("font-size");
      }
      if (lineHeight && lineHeight != "") {
        endSession.style.setProperty(
          "line-height",
          `${lineHeight || 18}px`,
          "important"
        );
      } else {
        endSession.style.removeProperty("line-height");
      }
    }

    // Transcript Toggle Button Styles
    const transcriptButtons = document.querySelectorAll(
      ".transcriptToggleButton"
    );
    if (transcriptButtons.length > 0) {
      var transcriptButtonEl =
        chatBoxStyleEl.querySelector(".transcript-button");

      if (transcriptButtonEl) {
        var bg = transcriptButtonEl.querySelector(".background")?.value.trim();
        var textColor = transcriptButtonEl
          .querySelector(".color")
          ?.value.trim();
        var borderWidth = transcriptButtonEl
          .querySelector(".border-width")
          ?.value.trim();
        var borderStyle = transcriptButtonEl
          .querySelector(".border-style")
          ?.value.trim();
        var borderColor = transcriptButtonEl
          .querySelector(".border-color")
          ?.value.trim();
        var borderRadius = transcriptButtonEl
          .querySelector(".border-radius-input")
          ?.value.trim();
        var padding = transcriptButtonEl
          .querySelector(".padding-input")
          ?.value.trim();
        var fontSize = transcriptButtonEl
          .querySelector(".font-size")
          ?.value.trim();

        transcriptButtons.forEach((button) => {
          if (bg && bg != "") {
            button.style.setProperty("background", `${bg}`, "important");
          } else {
            button.style.setProperty(
              "background",
              "rgba(139, 92, 246, 0.5)",
              "important"
            );
          }
          if (borderWidth && borderWidth >= 0) {
            button.style.setProperty(
              "border",
              `${borderWidth || 1}px ${borderStyle || "solid"} ${
                borderColor || "#000000"
              }`,
              "important"
            );
          } else {
            button.style.setProperty(
              "border",
              "1px solid #000000",
              "important"
            );
          }
          if (borderRadius && borderRadius >= 0) {
            button.style.setProperty(
              "border-radius",
              `${borderRadius}px`,
              "important"
            );
          } else {
            button.style.setProperty("border-radius", "8px", "important");
          }
          if (padding && padding >= 0) {
            button.style.setProperty("padding", `${padding}px`, "important");
          } else {
            button.style.setProperty("padding", "10px", "important");
          }
          if (textColor && textColor != "") {
            button.style.setProperty("color", `${textColor}`, "important");
            const icons = button.querySelectorAll("i");
            icons.forEach((icon) => {
              icon.style.setProperty("color", `${textColor}`, "important");
            });
          } else {
            button.style.setProperty("color", "#FFFFFF", "important");
            const icons = button.querySelectorAll("i");
            icons.forEach((icon) => {
              icon.style.setProperty("color", "#FFFFFF", "important");
            });
          }
          if (fontSize && fontSize >= 0) {
            button.style.setProperty("font-size", `${fontSize}px`, "important");
            const icons = button.querySelectorAll("i");
            icons.forEach((icon) => {
              icon.style.setProperty("font-size", `${fontSize}px`, "important");
            });
          } else {
            button.style.setProperty("font-size", "14px", "important");
            const icons = button.querySelectorAll("i");
            icons.forEach((icon) => {
              icon.style.setProperty("font-size", "14px", "important");
            });
          }
        });
      }
    }

    // Chat Mute Button Styles
    if (micToggler) {
      var micButtonEl = chatBoxStyleEl.querySelector(".mic-button");
      var bg = micButtonEl.querySelector(".background").value.trim();
      var textColor = micButtonEl.querySelector(".color").value.trim();
      var borderWidth = micButtonEl.querySelector(".border-width").value.trim();
      var borderStyle = micButtonEl.querySelector(".border-style").value.trim();
      var borderColor = micButtonEl.querySelector(".border-color").value.trim();
      var textAlign = micButtonEl.querySelector(".text-align").value.trim();
      var fontSize = micButtonEl.querySelector(".font-size").value.trim();
      var lineHeight = micButtonEl.querySelector(".line-height").value.trim();
      var borderRadiusLeft = micButtonEl
        .querySelector(".border-radius-left")
        .value.trim();
      var borderRadiusTop = micButtonEl
        .querySelector(".border-radius-top")
        .value.trim();
      var borderRadiusRight = micButtonEl
        .querySelector(".border-radius-right")
        .value.trim();
      var borderRadiusBottom = micButtonEl
        .querySelector(".border-radius-bottom")
        .value.trim();
      var paddingLeft = micButtonEl.querySelector(".padding-left").value.trim();
      var paddingTop = micButtonEl.querySelector(".padding-top").value.trim();
      var paddingRight = micButtonEl
        .querySelector(".padding-right")
        .value.trim();
      var paddingBottom = micButtonEl
        .querySelector(".padding-bottom")
        .value.trim();

      if (bg && bg != "") {
        micToggler.style.setProperty("background", `${bg}`, "important");
      } else {
        micToggler.style.removeProperty("background");
      }
      if (borderWidth && borderWidth >= 0) {
        micToggler.style.setProperty(
          "border",
          `${borderWidth || 0}px ${borderStyle || "solid"} ${
            borderColor || "transparent"
          }`,
          "important"
        );
      } else {
        micToggler.style.removeProperty("border");
      }
      if (
        [
          borderRadiusTop,
          borderRadiusRight,
          borderRadiusBottom,
          borderRadiusLeft,
        ].some((p) => isNumeric(p) && Number(p) >= 0)
      ) {
        micToggler.style.setProperty(
          "border-radius",
          `${borderRadiusTop || 0}px ${borderRadiusRight || 0}px ${
            borderRadiusBottom || 0
          }px ${borderRadiusLeft || 0}px`,
          "important"
        );
      } else {
        micToggler.style.removeProperty("border-radius");
      }
      if (
        [paddingTop, paddingRight, paddingBottom, paddingLeft].some(
          (p) => isNumeric(p) && Number(p) >= 0
        )
      ) {
        micToggler.style.setProperty(
          "padding",
          `${paddingTop || 0}px ${paddingRight || 0}px ${
            paddingBottom || 0
          }px ${paddingLeft || 0}px`,
          "important"
        );
      } else {
        micToggler.style.removeProperty("padding");
      }
      if (textColor && textColor != "") {
        micToggler.style.setProperty("color", `${textColor}`, "important");
      } else {
        micToggler.style.removeProperty("color");
      }
      if (textAlign && textAlign != "") {
        micToggler.style.setProperty(
          "text-align",
          `${textAlign || "left"}`,
          "important"
        );
      } else {
        micToggler.style.removeProperty("text-align");
      }
      if (fontSize && fontSize != "") {
        micToggler.style.setProperty(
          "font-size",
          `${fontSize || 14}px`,
          "important"
        );
      } else {
        micToggler.style.removeProperty("font-size");
      }
      if (lineHeight && lineHeight != "") {
        micToggler.style.setProperty(
          "line-height",
          `${lineHeight || 18}px`,
          "important"
        );
      } else {
        micToggler.style.removeProperty("line-height");
      }
    }

    // Fullscreen Button Styles
    const fullscreenButtons = document.querySelectorAll(".action-fullscreen");
    if (fullscreenButtons.length > 0) {
      var fullscreenButtonEl =
        chatBoxStyleEl.querySelector(".fullscreen-button");

      if (fullscreenButtonEl) {
        var bg = fullscreenButtonEl.querySelector(".background")?.value.trim();
        var textColor = fullscreenButtonEl
          .querySelector(".color")
          ?.value.trim();
        var borderWidth = fullscreenButtonEl
          .querySelector(".border-width")
          ?.value.trim();
        var borderStyle = fullscreenButtonEl
          .querySelector(".border-style")
          ?.value.trim();
        var borderColor = fullscreenButtonEl
          .querySelector(".border-color")
          ?.value.trim();
        var borderRadius = fullscreenButtonEl
          .querySelector(".border-radius-input")
          ?.value.trim();
        var padding = fullscreenButtonEl
          .querySelector(".padding-input")
          ?.value.trim();
        var fontSize = fullscreenButtonEl
          .querySelector(".font-size")
          ?.value.trim();
        var iconSize = fullscreenButtonEl
          .querySelector(".icon-size")
          ?.value.trim();

        fullscreenButtons.forEach((button) => {
          if (bg && bg != "") {
            button.style.setProperty("background", `${bg}`, "important");
          } else {
            button.style.setProperty(
              "background",
              "rgba(59, 130, 246, 0.5)",
              "important"
            );
          }
          if (borderWidth && borderWidth >= 0) {
            button.style.setProperty(
              "border",
              `${borderWidth || 1}px ${borderStyle || "solid"} ${
                borderColor || "#000000"
              }`,
              "important"
            );
          } else {
            button.style.setProperty(
              "border",
              "1px solid #000000",
              "important"
            );
          }
          if (borderRadius && borderRadius >= 0) {
            button.style.setProperty(
              "border-radius",
              `${borderRadius}px`,
              "important"
            );
          } else {
            button.style.setProperty("border-radius", "8px", "important");
          }
          if (padding && padding >= 0) {
            button.style.setProperty("padding", `${padding}px`, "important");
          } else {
            button.style.setProperty("padding", "10px", "important");
          }
          if (textColor && textColor != "") {
            button.style.setProperty("color", `${textColor}`, "important");
            const icons = button.querySelectorAll("i");
            icons.forEach((icon) => {
              icon.style.setProperty("color", `${textColor}`, "important");
            });
          } else {
            button.style.setProperty("color", "#FFFFFF", "important");
            const icons = button.querySelectorAll("i");
            icons.forEach((icon) => {
              icon.style.setProperty("color", "#FFFFFF", "important");
            });
          }
          if (fontSize && fontSize >= 0) {
            button.style.setProperty("font-size", `${fontSize}px`, "important");
          } else {
            button.style.setProperty("font-size", "14px", "important");
          }
          if (iconSize && iconSize >= 0) {
            const icons = button.querySelectorAll("i");
            icons.forEach((icon) => {
              icon.style.setProperty("font-size", `${iconSize}px`, "important");
            });
          } else {
            const icons = button.querySelectorAll("i");
            icons.forEach((icon) => {
              icon.style.setProperty("font-size", "16px", "important");
            });
          }
        });
      }
    }

    // Close Button Styles
    if (document.getElementById("chatBox-close")) {
      var closeButtonEl = chatBoxStyleEl.querySelector(".close-button");

      if (closeButtonEl) {
        var bg = closeButtonEl
          .querySelector('input[name="styles[close-button][background]"]')
          ?.value.trim();
        var hoverBg = closeButtonEl
          .querySelector('input[name="styles[close-button][hover-background]"]')
          ?.value.trim();
        var textColor = closeButtonEl
          .querySelector('input[name="styles[close-button][color]"]')
          ?.value.trim();
        var borderWidth = closeButtonEl
          .querySelector('input[name="styles[close-button][border][width]"]')
          ?.value.trim();
        var borderStyle = closeButtonEl
          .querySelector('select[name="styles[close-button][border][style]"]')
          ?.value.trim();
        var borderColor = closeButtonEl
          .querySelector('input[name="styles[close-button][border][color]"]')
          ?.value.trim();
        var borderRadius = closeButtonEl
          .querySelector('input[name="styles[close-button][border-radius]"]')
          ?.value.trim();
        var fontSize = closeButtonEl
          .querySelector('input[name="styles[close-button][font-size]"]')
          ?.value.trim();
        var size = closeButtonEl
          .querySelector('input[name="styles[close-button][size]"]')
          ?.value.trim();
        var positionTop = closeButtonEl
          .querySelector('input[name="styles[close-button][position-top]"]')
          ?.value.trim();
        var positionRight = closeButtonEl
          .querySelector('input[name="styles[close-button][position-right]"]')
          ?.value.trim();

        const closeBtn = document.getElementById("chatBox-close");

        if (bg && bg != "") {
          closeBtn.style.setProperty("background", `${bg}`, "important");
        } else {
          closeBtn.style.setProperty(
            "background",
            "rgba(220, 38, 38, 0.5)",
            "important"
          );
        }
        if (hoverBg && hoverBg != "") {
          closeBtn.setAttribute("data-hover-bg", hoverBg);
        }
        if (size && size >= 0) {
          closeBtn.style.setProperty("width", `${size}px`, "important");
          closeBtn.style.setProperty("height", `${size}px`, "important");
          closeBtn.style.setProperty("min-width", `${size}px`, "important");
          closeBtn.style.setProperty("min-height", `${size}px`, "important");
        } else {
          closeBtn.style.setProperty("width", "32px", "important");
          closeBtn.style.setProperty("height", "32px", "important");
        }
        if (borderWidth && borderWidth >= 0) {
          closeBtn.style.setProperty(
            "border",
            `${borderWidth || 0}px ${borderStyle || "solid"} ${
              borderColor || "transparent"
            }`,
            "important"
          );
        } else {
          closeBtn.style.removeProperty("border");
        }
        if (borderRadius && borderRadius >= 0) {
          closeBtn.style.setProperty(
            "border-radius",
            `${borderRadius}%`,
            "important"
          );
        } else {
          closeBtn.style.setProperty("border-radius", "50%", "important");
        }
        if (positionTop && positionTop >= 0) {
          closeBtn.style.setProperty("top", `${positionTop}px`, "important");
        } else {
          closeBtn.style.setProperty("top", "10px", "important");
        }
        if (positionRight && positionRight >= 0) {
          closeBtn.style.setProperty(
            "right",
            `${positionRight}px`,
            "important"
          );
        } else {
          closeBtn.style.setProperty("right", "10px", "important");
        }
        if (textColor && textColor != "") {
          closeBtn.style.setProperty("color", `${textColor}`, "important");
          const closeIcon = closeBtn.querySelector("i");
          if (closeIcon) {
            closeIcon.style.setProperty("color", `${textColor}`, "important");
          }
        } else {
          closeBtn.style.setProperty("color", "#FFFFFF", "important");
          const closeIcon = closeBtn.querySelector("i");
          if (closeIcon) {
            closeIcon.style.setProperty("color", "#FFFFFF", "important");
          }
        }
        if (fontSize && fontSize >= 0) {
          closeBtn.style.setProperty("font-size", `${fontSize}px`, "important");
          const closeIcon = closeBtn.querySelector("i");
          if (closeIcon) {
            closeIcon.style.setProperty(
              "font-size",
              `${fontSize}px`,
              "important"
            );
          }
        } else {
          closeBtn.style.removeProperty("font-size");
        }
        const closeButtonLabel = document.getElementById("close_button_label");
        if (closeButtonLabel) {
          const label = closeButtonLabel.value.trim();
          if (label) {
            closeBtn.setAttribute("title", label);
          } else {
            closeBtn.setAttribute("title", "Close Window");
          }
        }
      }
    }

    // Update opening texts in preview
    const openingTexts = {
      en: document.getElementById("welcome_message_en")?.value || "",
      es: document.getElementById("welcome_message_es")?.value || "",
      fr: document.getElementById("welcome_message_fr")?.value || "",
      de: document.getElementById("welcome_message_de")?.value || "",
    };

    const startSessionBtn = document.getElementById("startSession");
    if (startSessionBtn) {
      const currentLang =
        document
          .querySelector(".avatar_studio-tab-content.active")
          ?.id?.replace("avatar_studio-tab-", "") || "en";
      const openingText = openingTexts[currentLang] || openingTexts.en;
      startSessionBtn.setAttribute("initial_message", openingText);
      startSessionBtn.setAttribute("opening_text", openingText);
    }
  }

  // Tab switching
  function initTabSwitching() {
    document.querySelectorAll(".tab-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const avatar_studioTabs = e.target.closest(".avatar_studio-tabs");
        const tab = e.target.getAttribute("data-tab");

        avatar_studioTabs
          .querySelectorAll(":scope > .tab-btn")
          .forEach((btn) => btn.classList.remove("active"));
        avatar_studioTabs
          .querySelectorAll(":scope > .avatar_studio-tab-content")
          .forEach((content) => content.classList.remove("active"));

        avatar_studioTabs
          .querySelector("#avatar_studio-tab-" + tab)
          .classList.add("active");
        e.target.classList.add("active");

        const openingTexts = {
          en: document.getElementById("welcome_message_en")?.value || "",
          es: document.getElementById("welcome_message_es")?.value || "",
          fr: document.getElementById("welcome_message_fr")?.value || "",
          de: document.getElementById("welcome_message_de")?.value || "",
        };

        const startSessionBtn = document.getElementById("startSession");
        if (startSessionBtn) {
          const openingText = openingTexts[tab] || openingTexts.en;
          startSessionBtn.setAttribute("initial_message", openingText);
          startSessionBtn.setAttribute("opening_text", openingText);
        }
      });
    });
  }

  // Preview mode toggle
  function initPreviewMode() {
    const previewModeBtns = document.querySelectorAll(".preview-mode-btn");
    const chatBox = document.getElementById("chatBox");
    const previewStateIndicator = document.getElementById(
      "previewStateIndicator"
    );

    previewModeBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const mode = this.getAttribute("data-mode");

        previewModeBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        const chatModeBtn = document.querySelector(
          'button[data-tab="switch-button"]'
        );
        const micBtn = document.querySelector('button[data-tab="mic-button"]');
        const cameraBtn = document.querySelector(
          'button[data-tab="camera-button"]'
        );
        const endBtn = document.querySelector('button[data-tab="end-button"]');
        const transcriptBtn = document.querySelector(
          'button[data-tab="transcript-button"]'
        );
        const fullscreenBtn = document.querySelector(
          'button[data-tab="fullscreen-button"]'
        );
        const closeBtn = document.querySelector(
          'button[data-tab="close-button"]'
        );
        const startBtn = document.querySelector(
          'button[data-tab="start-button"]'
        );

        if (mode === "before") {
          if (chatModeBtn) chatModeBtn.style.display = "none";
          if (micBtn) micBtn.style.display = "none";
          if (cameraBtn) cameraBtn.style.display = "none";
          if (endBtn) endBtn.style.display = "none";
          if (transcriptBtn) transcriptBtn.style.display = "inline-block";
          if (fullscreenBtn) fullscreenBtn.style.display = "inline-block";
          if (closeBtn) closeBtn.style.display = "inline-block";
          if (startBtn) startBtn.style.display = "inline-block";

          chatBox.classList.remove("session-during");
          chatBox.classList.add("session-before");
          previewStateIndicator.textContent = "Before Session";
          previewStateIndicator.style.background =
            "linear-gradient(135deg, #38b1c5 0%, #da922c 100%)";

          const welcomeContainer = chatBox.querySelector(".welcomeContainer");
          const videoHolder = chatBox.querySelector("#video_holder");
          const actionContainer = chatBox.querySelector(".actionContainer");

          if (welcomeContainer) welcomeContainer.style.display = "block";
          if (videoHolder) videoHolder.style.display = "flex";
          if (actionContainer) actionContainer.style.display = "none";
        } else {
          if (chatModeBtn) chatModeBtn.style.display = "inline-block";
          if (micBtn) micBtn.style.display = "inline-block";
          if (cameraBtn) cameraBtn.style.display = "inline-block";
          if (endBtn) endBtn.style.display = "inline-block";
          if (transcriptBtn) transcriptBtn.style.display = "none";
          if (fullscreenBtn) fullscreenBtn.style.display = "none";
          if (closeBtn) closeBtn.style.display = "none";
          if (startBtn) startBtn.style.display = "none";

          chatBox.classList.remove("session-before");
          chatBox.classList.add("session-during");
          previewStateIndicator.style.background =
            "linear-gradient(135deg, #10b981 0%, #059669 100%)";

          const welcomeContainer = chatBox.querySelector(".welcomeContainer");
          const videoHolder = chatBox.querySelector("#video_holder");
          const actionContainer = chatBox.querySelector(".actionContainer");

          if (welcomeContainer) {
            const loadingIcon = welcomeContainer.querySelector(".loading-icon");
            const loadingText = welcomeContainer.querySelector(".loadingText");
            if (loadingIcon) loadingIcon.style.display = "none";
            if (loadingText) loadingText.style.display = "none";
            welcomeContainer.style.display = "block";
          }
          if (videoHolder) videoHolder.style.display = "block";
          if (actionContainer) actionContainer.style.display = "flex";
        }

        showChatBoxPreview();
      });
    });
  }

  // Close button hover effect
  function initCloseButtonHover() {
    document.addEventListener("mouseover", function (e) {
      const closeBtn = document.getElementById("chatBox-close");
      if (closeBtn && closeBtn.contains(e.target)) {
        const hoverBg = closeBtn.getAttribute("data-hover-bg");
        if (hoverBg) {
          closeBtn.style.setProperty("background", hoverBg, "important");
        }
      }
    });

    document.addEventListener("mouseout", function (e) {
      const closeBtn = document.getElementById("chatBox-close");
      if (closeBtn && closeBtn.contains(e.target)) {
        const closeButtonEl = document.querySelector(".close-button");
        const bg = closeButtonEl
          ?.querySelector('input[name="styles[close-button][background]"]')
          ?.value.trim();
        if (bg) {
          closeBtn.style.setProperty("background", bg, "important");
        } else {
          closeBtn.style.setProperty(
            "background",
            "rgba(220, 38, 38, 0.5)",
            "important"
          );
        }
      }
    });
  }

  // Image uploader
  function initImageUploader() {
    document
      .querySelectorAll(".upload-image-btn")
      .forEach(function (uploadBtn) {
        uploadBtn.addEventListener("click", function (e) {
          e.preventDefault();

          imageUploaderWrap = e.target.closest(".image-uploader-wrap");

          if (frame) {
            frame.open();
            return;
          }

          frame = wp.media({
            title: "Select or Upload an Image",
            button: {
              text: "Use this image",
            },
            multiple: false,
          });

          frame.on("select", function () {
            const attachment = frame.state().get("selection").first().toJSON();
            const imageInput = imageUploaderWrap.querySelector(".image-url");
            const imagePreview =
              imageUploaderWrap.querySelector(".image-preview");
            const removeBtn =
              imageUploaderWrap.querySelector(".remove-image-btn");

            imageInput.value = attachment.url;
            imagePreview.src = attachment.url;
            imagePreview.style.display = "block";
            removeBtn.style.display = "inline-block";

            const event = new Event("change", { bubbles: true });
            imageInput.dispatchEvent(event);
          });

          frame.open();
        });
      });

    document
      .querySelectorAll(".remove-image-btn")
      .forEach(function (removeBtn) {
        removeBtn.addEventListener("click", function (e) {
          e.preventDefault();

          imageUploaderWrap = e.target.closest(".image-uploader-wrap");
          const imageInput = imageUploaderWrap.querySelector(".image-url");
          const imagePreview =
            imageUploaderWrap.querySelector(".image-preview");

          imageInput.value = "";
          imagePreview.src = "";
          imagePreview.style.display = "none";
          removeBtn.style.display = "none";

          const event = new Event("change", { bubbles: true });
          imageInput.dispatchEvent(event);
        });
      });
  }

  // Start button label update
  function initStartButtonLabel() {
    const startButtonLabel = document.getElementById("start_button_label");
    const startSessionBtn = document.getElementById("startSession");

    if (startButtonLabel && startSessionBtn) {
      startButtonLabel.addEventListener("input", function () {
        const label = this.value.trim();
        startSessionBtn.textContent = label || "Start Chat";
      });
    }
  }

  // Copy shortcode
  function initCopyShortcode() {
    $(".copy-shortcode-btn").on("click", function (e) {
      e.preventDefault();
      var $btn = $(this);
      var shortcode = $btn.data("shortcode");

      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val(shortcode).select();
      document.execCommand("copy");
      $temp.remove();

      var originalText = $btn.text();
      $btn.text("Copied!");
      setTimeout(function () {
        $btn.text(originalText);
      }, 2000);
    });
  }

  // Preview image monitor
  function initPreviewImageMonitor() {
    $("#preview_image").on("change input", function () {
      const newImageUrl = $(this).val();

      if (newImageUrl) {
        $("#avatarVideo").attr("poster", newImageUrl);
        $("#previewImage").attr("src", newImageUrl);
        $(this)
          .closest(".image-uploader-wrap")
          .find(".image-preview")
          .attr("src", newImageUrl)
          .show();
        $(this)
          .closest(".image-uploader-wrap")
          .find(".remove-image-btn")
          .show();
      } else {
        const defaultImage = avatarFormAdmin.previewImage;
        $("#avatarVideo").attr("poster", defaultImage);
        $("#previewImage").attr("src", defaultImage);
      }
    });

    $(".upload-image-btn").on("click", function () {
      const wrapper = $(this).closest(".image-uploader-wrap");
      const inputField = wrapper.find(".image-url");

      if (frame) {
        frame.off("select");
        frame.on("select", function () {
          const attachment = frame.state().get("selection").first().toJSON();
          inputField.val(attachment.url).trigger("change");
          wrapper.find(".image-preview").attr("src", attachment.url).show();
          wrapper.find(".remove-image-btn").show();
        });
      }
    });

    $(".remove-image-btn").on("click", function () {
      const wrapper = $(this).closest(".image-uploader-wrap");
      wrapper.find(".image-url").val("").trigger("change");
    });
  }

  // Initialize everything on document ready
  $(document).ready(function () {
    // Initial preview render
    showChatBoxPreview();

    // Initialize all components
    initTabSwitching();
    initPreviewMode();
    initCloseButtonHover();
    initImageUploader();
    initStartButtonLabel();
    initCopyShortcode();
    initPreviewImageMonitor();

    // Update preview on input change
    $("#chatBox-style input, input#avatar_title, input#preview_image").each(
      function () {
        $(this).on("input change", showChatBoxPreview);

        const container = $(this).closest(".input-controls");
        if (container.length) {
          const clearBtn = container.find(".clear-btn");
          if (clearBtn.length) {
            clearBtn.css("display", $(this).val() != "" ? "block" : "none");
          }
        }
      }
    );

    $("#chatBox-style select").on("change", showChatBoxPreview);

    // Initialize gradient color pickers
    $("#chatBox-style input.gradient-color-picker").each(function () {
      new lc_color_picker(this, {
        no_input_mode: true,
        on_change: function (new_value, target_field) {
          showChatBoxPreview();
          const container = $(target_field).closest(".input-controls");
          const clearBtn = container.find(".clear-btn");
          if (clearBtn.length) {
            clearBtn.css(
              "display",
              $(target_field).val() != "" ? "block" : "none"
            );
          }
        },
      });

      const container = $(this).closest(".input-controls");
      if (container.length) {
        const clearBtn = container.find(".clear-btn");
        if (clearBtn.length) {
          clearBtn.css("display", $(this).val() != "" ? "block" : "none");
        }
      }
    });

    // Initialize color pickers
    $("#chatBox-style .color-picker").wpColorPicker({
      change: function (event, ui) {
        showChatBoxPreview(event);
      },
      hide: function (event, ui) {
        showChatBoxPreview(event);
      },
    });
  });
})(jQuery);
// Function to update toast notification preview
function updateToastPreview(type, buttonElement = null) {
  const container = document.querySelector(
    ".preview-container .toast-notification-container"
  );

  if (!container) {
    // Create container if it doesn't exist
    const previewArea = document.querySelector(".preview-container");
    if (previewArea) {
      const newContainer = document.createElement("div");
      newContainer.className =
        "toast-notification-container preview-toast-container";
      newContainer.style.cssText =
        "position: absolute !important; z-index: 10000 !important; top: 60px !important; right: 20px !important; display: flex !important; flex-direction: column !important; gap: 12px !important;";
      previewArea.appendChild(newContainer);
      container = newContainer;
    } else {
      console.error("Preview area not found");
      return;
    }
  }

  // Clear existing toasts
  container.innerHTML = "";

  if (type) {
    // Remove active class from all toast buttons
    const allToastButtons = document.querySelectorAll(
      '.avatar_studio-tab-buttons .tab-btn[data-tab^="toast-"]'
    );
    allToastButtons.forEach((btn) => btn.classList.remove("active"));

    // Add active class to clicked button if provided
    if (buttonElement) {
      buttonElement.classList.add("active");
    } else {
      // Find and activate the button matching the type
      const buttonToActivate = document.querySelector(
        `.avatar_studio-tab-buttons .tab-btn[data-tab="toast-${type}"]`
      );
      if (buttonToActivate) {
        buttonToActivate.classList.add("active");
      }
    }

    showToastPreview(type);
  }
}

// Show toast notification in preview
function showToastPreview(type) {
  const container = document.querySelector(
    ".preview-container .toast-notification-container"
  );
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `notification ${type}`;
  toast.style.cssText =
    "position: relative !important; opacity: 1 !important; animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;";

  const messageSpan = document.createElement("span");
  messageSpan.className = "notification-message";
  messageSpan.textContent = getToastMessage(type);

  toast.appendChild(messageSpan);
  container.appendChild(toast);

  // Apply current styles
  applyToastStylesToElement(toast, type);
}

// Apply styles to specific toast element
function applyToastStylesToElement(toastElement, type) {
  const background = document.querySelector(
    `input[name="styles[toast-${type}][background]"]`
  )?.value;
  const color = document.querySelector(
    `input[name="styles[toast-${type}][color]"]`
  )?.value;
  const borderColor = document.querySelector(
    `input[name="styles[toast-${type}][border-color]"]`
  )?.value;
  const borderWidth =
    document.querySelector(`input[name="styles[toast-${type}][border-width]"]`)
      ?.value || "1";
  const borderRadius =
    document.querySelector(`input[name="styles[toast-${type}][border-radius]"]`)
      ?.value || "12";
  const padding =
    document.querySelector(`input[name="styles[toast-${type}][padding]"]`)
      ?.value || "12";
  const fontSize =
    document.querySelector(`input[name="styles[toast-${type}][font-size]"]`)
      ?.value || "14";
  const boxShadow = document.querySelector(
    `input[name="styles[toast-${type}][box-shadow]"]`
  )?.value;

  // Apply styles
  if (background) {
    toastElement.style.background = background;
  }
  if (color) {
    toastElement.style.color = color;
  }
  if (borderColor) {
    toastElement.style.border = `${borderWidth}px solid ${borderColor}`;
  }
  if (borderRadius) {
    toastElement.style.borderRadius = `${borderRadius}px`;
  }
  if (padding) {
    toastElement.style.padding = `${padding}px 16px`;
  }
  if (fontSize) {
    toastElement.style.fontSize = `${fontSize}px`;
  }
  if (boxShadow) {
    toastElement.style.boxShadow = boxShadow;
  }
}

// Get toast message based on type
function getToastMessage(type) {
  switch (type) {
    case "success":
      return "Success: This is a demo success message";
    case "error":
      return "Error: This is a demo error message";
    case "warning":
      return "Warning: This is a demo warning message";
    case "info":
      return "Info: This is a demo info message";
    // default:
    //   return "Demo message";
  }
}

// Add event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Remove active class from all toast buttons on page load
  const toastTabButtons = document.querySelectorAll(
    '.avatar_studio-tab-buttons .tab-btn[data-tab^="toast-"]'
  );
  toastTabButtons.forEach((btn) => btn.classList.remove("active"));

  // Listen to changes on all toast style inputs
  const toastInputs = document.querySelectorAll('input[name*="styles[toast-"]');
  toastInputs.forEach((input) => {
    input.addEventListener("input", function () {
      // Get the toast type from the input name
      const inputName = this.name;
      const typeMatch = inputName.match(
        /styles\[toast-(success|error|warning|info)\]/
      );
      if (typeMatch && typeMatch[1]) {
        const type = typeMatch[1];
        // Check if this toast type is currently displayed
        const activeToast = document.querySelector(
          ".preview-toast-container .notification." + type
        );
        if (activeToast) {
          // Update the displayed toast
          applyToastStylesToElement(activeToast, type);
        }
      }
    });
  });

  // Listen to toast tab button clicks
  toastTabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const type = this.dataset.tab.replace("toast-", "");

      // Check if this button is already active
      if (this.classList.contains("active")) {
        // Button is already active, remove the toast
        const toastContainer = document.querySelector(
          ".preview-toast-container"
        );
        if (toastContainer) {
          toastContainer.remove();
        }
        this.classList.remove("active");
      } else {
        // Show the toast when button is clicked
        updateToastPreview(type, this);
      }
    });
  });

  // Clear toasts when switching away from toast notifications tab
  const allTabButtons = document.querySelectorAll(
    ".avatar_studio-tab-buttons .tab-btn[data-tab]"
  );
  allTabButtons.forEach((tab) => {
    tab.addEventListener("click", function () {
      if (!this.dataset.tab.startsWith("toast-")) {
        // Remove toast container when switching away from toast notifications
        const toastContainer = document.querySelector(
          ".preview-toast-container"
        );
        if (toastContainer) {
          toastContainer.remove();
        }
        // Remove active class from all toast buttons
        toastTabButtons.forEach((btn) => btn.classList.remove("active"));
      }
    });
  });

  // Clear toasts when switching preview modes
  const previewModeButtons = document.querySelectorAll(".preview-mode-btn");
  previewModeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove toast container when switching preview modes
      const toastContainer = document.querySelector(".preview-toast-container");
      if (toastContainer) {
        toastContainer.remove();
      }
      // Remove active class from all toast buttons
      toastTabButtons.forEach((btn) => btn.classList.remove("active"));
    });
  });

  // Clear toasts when clicking outside
  document.addEventListener("click", function (e) {
    // Check if click is on a toast button or inside toast container
    const isToastButton = e.target.closest('.tab-btn[data-tab^="toast-"]');
    const isToastContainer = e.target.closest(".preview-toast-container");

    if (!isToastButton && !isToastContainer) {
      // Remove active class from all toast buttons
      toastTabButtons.forEach((btn) => btn.classList.remove("active"));

      // Remove toast container if it exists
      const toastContainer = document.querySelector(".preview-toast-container");
      if (toastContainer) {
        toastContainer.remove();
      }
    }
  });
});
// Initialize toast preview when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Wait for everything to load
  setTimeout(() => {
    const activeToastTab = document.querySelector(
      '.avatar_studio-tab-buttons .tab-btn.active[data-tab^="toast-"]'
    );
    if (
      activeToastTab &&
      document
        .querySelector("#avatar_studio-tab-toast-notifications")
        .classList.contains("active")
    ) {
      const type = activeToastTab.dataset.tab.replace("toast-", "");
      showToastPreview(type);
    }
  }, 500);
});
