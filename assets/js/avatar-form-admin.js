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
            "linear-gradient(135deg, #05D686 0%, #007649 100%)";

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
// Toast Notification Styling and Preview
(function ($) {
  "use strict";

  // Initialize toast preview
  function initToastPreview() {
    const toastContainer = createToastPreviewContainer();
    let currentToastType = null;
    let updateTimeout = null;

    // Listen to toast tab button clicks
    $('.tab-btn[data-tab^="toast-"]').on("click", function (e) {
      e.preventDefault();
      const type = $(this).data("tab").replace("toast-", "");

      // Toggle active state
      $('.tab-btn[data-tab^="toast-"]').removeClass("active");
      $(this).addClass("active");

      // Update current toast type
      currentToastType = type;

      // Show/hide toast preview
      if (type) {
        updateToastPreview(type);
      }
    });

    // DIRECT EVENT HANDLING for your specific color pickers
    function setupDirectColorPickerListeners() {
      console.log("Setting up direct color picker listeners...");

      // Method 1: Direct event delegation on all inputs
      $(document).on(
        "input propertychange change",
        'input[name*="styles[toast-"]',
        function (e) {
          console.log(
            "Input event detected:",
            e.type,
            "on",
            this.name,
            "value:",
            this.value
          );

          if (currentToastType) {
            // Debounce updates to prevent excessive re-renders
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(function () {
              updateToastPreview(currentToastType);
            }, 50);
          }
        }
      );

      // Method 2: Special handling for color picker classes
      $(document).on(
        "input propertychange change",
        ".color-picker, .gradient-color-picker",
        function (e) {
          console.log(
            "Color picker event:",
            e.type,
            "on",
            this.name,
            "value:",
            this.value
          );

          if (currentToastType) {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(function () {
              updateToastPreview(currentToastType);
            }, 50);
          }
        }
      );

      // Method 3: Listen to the clear button click
      $(document).on("click", ".clear-btn", function () {
        console.log("Clear button clicked");

        // Get the associated input
        const $input = $(this).closest(".input-with-clear").find("input");
        if ($input.length && currentToastType) {
          setTimeout(function () {
            updateToastPreview(currentToastType);
          }, 100); // Small delay to allow value to clear
        }
      });

      // Method 4: Set up interval polling for stubborn color pickers
      // Some color pickers don't fire proper events
      startColorPolling();
    }

    // Polling method for stubborn color pickers
    function startColorPolling() {
      let lastValues = {};

      setInterval(function () {
        if (!currentToastType) return;

        const inputs = $('input[name*="styles[toast-"]');
        let changed = false;

        inputs.each(function () {
          const $input = $(this);
          const name = $input.attr("name");
          const currentValue = $input.val();

          if (lastValues[name] !== currentValue) {
            lastValues[name] = currentValue;
            changed = true;
          }
        });

        if (changed) {
          updateToastPreview(currentToastType);
        }
      }, 100); // Check every 100ms
    }

    // Debug function to log current styles
    function debugStyles(type) {
      console.log("Current styles for", type, ":", getToastStyles(type));
    }

    // Create and update toast preview
    function updateToastPreview(type) {
      console.log("Updating toast preview for:", type);

      // Debug current styles
      debugStyles(type);

      // Clear existing toast
      toastContainer.empty();

      // Create new toast
      const toast = $(`
                <div class="notification ${type} preview-toast">
                    <div class="notification-content">
                        <span class="notification-message">${getToastMessage(
                          type
                        )}</span>
                    </div>
                </div>
            `);

      // Apply styles
      applyToastStyles(toast, type);

      // Add to container
      toastContainer.append(toast);

      // Show toast with animation
      setTimeout(() => {
        toast.addClass("show");
      }, 10);
    }

    function applyToastStyles($toast, type) {
      const styles = getToastStyles(type);

      console.log("Applying styles:", styles);

      // Apply each style individually
      if (styles.background) {
        $toast.css("background", styles.background);
        console.log("Set background to:", styles.background);
      }

      if (styles.color) {
        $toast.css("color", styles.color);
        console.log("Set color to:", styles.color);
      }

      if (styles.borderColor && styles.borderWidth) {
        $toast.css(
          "border",
          `${styles.borderWidth}px solid ${styles.borderColor}`
        );
        console.log(
          "Set border to:",
          `${styles.borderWidth}px solid ${styles.borderColor}`
        );
      } else if (styles.borderColor) {
        $toast.css("border-color", styles.borderColor);
      } else if (styles.borderWidth) {
        $toast.css("border-width", `${styles.borderWidth}px`);
      }

      if (styles.borderRadius) {
        $toast.css("border-radius", `${styles.borderRadius}px`);
      }

      if (styles.padding) {
        $toast.css("padding", `${styles.padding}px`);
      }

      if (styles.fontSize) {
        $toast.css("font-size", `${styles.fontSize}px`);
      }

      if (styles.boxShadow) {
        $toast.css("box-shadow", styles.boxShadow);
      }

      // Base styles
      $toast.css({
        margin: "0",
        opacity: "1",
        right: "16px",
        top: "20px",
        transition: "all 0.3s ease",
        position: "relative",
        display: "block",
        "min-width": "300px",
      });

      // Also update the toast message color
      $toast.find(".notification-message").css({
        color: styles.color || "#ffffff",
      });
    }

    function getToastStyles(type) {
      const prefix = `styles[toast-${type}]`;

      // Get values directly from inputs
      const background = getInputValue(`${prefix}[background]`);
      const color = getInputValue(`${prefix}[color]`);
      const borderColor = getInputValue(`${prefix}[border-color]`);
      const borderWidth = getInputValue(`${prefix}[border-width]`);
      const borderRadius = getInputValue(`${prefix}[border-radius]`);
      const padding = getInputValue(`${prefix}[padding]`);
      const fontSize = getInputValue(`${prefix}[font-size]`);
      const boxShadow = getInputValue(`${prefix}[box-shadow]`);

      console.log("Raw input values:", {
        background,
        color,
        borderColor,
        borderWidth,
        borderRadius,
        padding,
        fontSize,
        boxShadow,
      });

      return {
        background: background || getDefaultToastStyle(type, "background"),
        color: color || getDefaultToastStyle(type, "color"),
        borderColor: borderColor || getDefaultToastStyle(type, "borderColor"),
        borderWidth: borderWidth || getDefaultToastStyle(type, "borderWidth"),
        borderRadius:
          borderRadius || getDefaultToastStyle(type, "borderRadius"),
        padding: padding || getDefaultToastStyle(type, "padding"),
        fontSize: fontSize || getDefaultToastStyle(type, "fontSize"),
        boxShadow: boxShadow || getDefaultToastStyle(type, "boxShadow"),
      };
    }

    function getInputValue(selectorName) {
      console.log("Looking for input:", selectorName);

      // Try direct selector
      let element = $(`input[name="${selectorName}"]`);

      if (!element.length) {
        // Try with escaped brackets for jQuery
        const escapedName = selectorName
          .replace(/\[/g, "\\[")
          .replace(/\]/g, "\\]");
        element = $(`input[name="${escapedName}"]`);
      }

      if (element.length) {
        const value = element.val();
        console.log("Found input value:", value, "for", selectorName);
        return value;
      }

      console.log("No input found for:", selectorName);
      return "";
    }

    function getDefaultToastStyle(type, property) {
      const defaults = {
        success: {
          background: "rgba(16, 185, 129, 0.15)",
          color: "#6ee7b7",
          borderColor: "rgba(52, 211, 153, 0.3)",
          borderWidth: "0",
          borderRadius: "12",
          padding: "12",
          fontSize: "14",
          boxShadow: "0 8px 32px rgba(16, 185, 129, 0.25)",
        },
        error: {
          background: "rgba(239, 68, 68, 0.15)",
          color: "#ff4d4d",
          borderColor: "rgba(248, 113, 113, 0.3)",
          borderWidth: "0",
          borderRadius: "12",
          padding: "12",
          fontSize: "14",
          boxShadow: "0 8px 32px rgba(239, 68, 68, 0.25)",
        },
        warning: {
          background: "rgba(234, 179, 8, 0.15)",
          color: "#fde047",
          borderColor: "rgba(250, 204, 21, 0.3)",
          borderWidth: "0",
          borderRadius: "12",
          padding: "12",
          fontSize: "14",
          boxShadow: "0 8px 32px rgba(234, 179, 8, 0.25)",
        },
        info: {
          background: "rgba(139, 92, 246, 0.15)",
          color: "#c4b5fd",
          borderColor: "rgba(167, 139, 250, 0.3)",
          borderWidth: "0",
          borderRadius: "12",
          padding: "12",
          fontSize: "14",
          boxShadow: "0 8px 32px rgba(139, 92, 246, 0.25)",
        },
      };

      return defaults[type]?.[property] || "";
    }

    function getToastMessage(type) {
      const messages = {
        success: "Success: This is a demo success message",
        error: "Error: This is a demo error message",
        warning: "Warning: This is a demo warning message",
        info: "Info: This is a demo info message",
      };
      return messages[type] || "";
    }

    function createToastPreviewContainer() {
      // Remove existing container if any
      $(".preview-toast-container").remove();

      // Create new container
      const container = $('<div class="preview-toast-container"></div>');
      container.css({
        position: "absolute",
        top: "60px",
        right: "20px",
        "z-index": "10000",
        display: "flex",
        "flex-direction": "column",
        gap: "12px",
      });

      // Add to preview area
      $(".preview-container").append(container);

      return container;
    }

    // Setup direct event listeners
    setupDirectColorPickerListeners();

    // Initialize with first toast type if available
    const firstToastBtn = $('.tab-btn[data-tab^="toast-"]').first();
    if (firstToastBtn.length) {
      firstToastBtn.trigger("click");
    }

    // Hide toast when switching to other tabs
    $('.tab-btn:not([data-tab^="toast-"])').on("click", function () {
      toastContainer.empty();
      currentToastType = null;
      $('.tab-btn[data-tab^="toast-"]').removeClass("active");
    });

    // Hide toast when switching preview modes
    $(".preview-mode-btn").on("click", function () {
      toastContainer.empty();
      currentToastType = null;
      $('.tab-btn[data-tab^="toast-"]').removeClass("active");
    });
  }

  // Initialize when document is ready
  $(document).ready(function () {
    console.log("Toast preview initialized");
    initToastPreview();
  });
})(jQuery);
jQuery(document).ready(function ($) {
  // Handle preview mode toggle
  $(".preview-mode-btn").on("click", function () {
    var mode = $(this).data("mode");

    // Update active button
    $(".preview-mode-btn").removeClass("active");
    $(this).addClass("active");

    // Show/hide tab groups based on mode
    if (mode === "before") {
      $(".session-before-tabs").show();
      $(".session-during-tabs").hide();

      // If Flash Messages tab is active, switch to first tab
      if (
        $(".session-during-tabs .tab-btn.active").data("tab") ===
        "toast-notifications"
      ) {
        $(".session-before-tabs .tab-btn:first").addClass("active");
        $(".session-before-tabs .tab-btn:first").trigger("click");
      }
    } else if (mode === "during") {
      $(".session-before-tabs").hide();
      $(".session-during-tabs").show();

      // Ensure Flash Messages tab is available
      if (!$(".session-during-tabs .tab-btn.active").length) {
        $(".session-during-tabs .tab-btn:first").addClass("active");
        $(".session-during-tabs .tab-btn:first").trigger("click");
      }
    }
  });

  // Tab switching function (you might already have this)
  $(".avatar_studio-tab-buttons").on("click", ".tab-btn", function () {
    var tabId = $(this).data("tab");

    // Update active tab button
    $(this)
      .closest(".avatar_studio-tab-buttons")
      .find(".tab-btn")
      .removeClass("active");
    $(this).addClass("active");

    // Show the corresponding tab content
    $(this)
      .closest(".avatar_studio-tabs")
      .find(".avatar_studio-tab-content")
      .removeClass("active");
    $("#avatar_studio-tab-" + tabId).addClass("active");
  });
});
jQuery(document).ready(function ($) {
  // Initialize color pickers for disclaimer and instruction styling
  $(".color-picker-field").wpColorPicker({
    change: function (event, ui) {
      updatePreview();
    },
  });

  // Update preview when any styling input changes
  $('input[name*="styles[disclaimer]"], input[name*="styles[instruction]"]').on(
    "input change",
    function () {
      updatePreview();
    }
  );

  // Function to update both previews
  function updatePreview() {
    updateDisclaimerPreview();
    updateInstructionPreview();
  }

  // Update disclaimer preview
  function updateDisclaimerPreview() {
    var background =
      $('input[name="styles[disclaimer][background]"]').val() ||
      "rgba(0, 0, 0, 0.85)";
    var opacity = $('input[name="styles[disclaimer][opacity]"]').val() || "0.9";
    var contentBg =
      $('input[name="styles[disclaimer][content_background]"]').val() ||
      "#ffffff";
    var borderRadius =
      $('input[name="styles[disclaimer][border_radius]"]').val() || "8";
    var headingColor =
      $('input[name="styles[disclaimer][heading_color]"]').val() || "#ffffff";
    var contentColor =
      $('input[name="styles[disclaimer][content_color]"]').val() || "#f8f9fa";
    var headingSize =
      $('input[name="styles[disclaimer][heading_size]"]').val() || "20";
    var contentSize =
      $('input[name="styles[disclaimer][content_size]"]').val() || "14";

    $("#disclaimer_preview").css({
      background: background,
      opacity: opacity,
    });

    $("#disclaimer_preview > div").css({
      background: contentBg,
      "border-radius": borderRadius + "px",
    });

    $("#disclaimer_preview h3").css({
      color: headingColor,
      "font-size": headingSize + "px",
    });

    $("#disclaimer_preview > div > div").css({
      color: contentColor,
      "font-size": contentSize + "px",
    });
  }

  // Update instruction preview
  function updateInstructionPreview() {
    var background =
      $('input[name="styles[instruction][background]"]').val() ||
      "rgba(0, 0, 0, 0.85)";
    var opacity =
      $('input[name="styles[instruction][opacity]"]').val() || "0.9";
    var contentBg =
      $('input[name="styles[instruction][content_background]"]').val() ||
      "#ffffff";
    var borderRadius =
      $('input[name="styles[instruction][border_radius]"]').val() || "8";
    var headingColor =
      $('input[name="styles[instruction][heading_color]"]').val() || "#ffffff";
    var contentColor =
      $('input[name="styles[instruction][content_color]"]').val() || "#f8f9fa";
    var headingSize =
      $('input[name="styles[instruction][heading_size]"]').val() || "20";
    var contentSize =
      $('input[name="styles[instruction][content_size]"]').val() || "14";

    $("#instruction_preview").css({
      background: background,
      opacity: opacity,
    });

    $("#instruction_preview > div").css({
      background: contentBg,
      "border-radius": borderRadius + "px",
    });

    $("#instruction_preview h3").css({
      color: headingColor,
      "font-size": headingSize + "px",
    });

    $("#instruction_preview > div > div").css({
      color: contentColor,
      "font-size": contentSize + "px",
    });
  }

  // Update disclaimer content preview when content changes
  $("#disclaimer_editor").on("input", function () {
    var content = $(this).val();
    if (content.length > 0) {
      var plainText = content.replace(/<[^>]*>/g, ""); // Strip HTML tags
      var previewText =
        plainText.substring(0, 200) + (plainText.length > 200 ? "..." : "");
      $("#disclaimer_preview > div > div").text(previewText);
    }
  });

  // Update instruction content preview when content changes
  $("#instruction_editor").on("input", function () {
    var content = $(this).val();
    if (content.length > 0) {
      var plainText = content.replace(/<[^>]*>/g, ""); // Strip HTML tags
      var previewText =
        plainText.substring(0, 200) + (plainText.length > 200 ? "..." : "");
      $("#instruction_preview > div > div").text(previewText);
    }
  });

  // Update disclaimer heading preview
  $("#disclaimer_title").on("input", function () {
    var heading = $(this).val() || "Disclaimer Heading";
    $("#disclaimer_preview h3").text(heading);
  });

  // Update instruction heading preview
  $("#instruction_title").on("input", function () {
    var heading = $(this).val() || "Instruction Heading";
    $("#instruction_preview h3").text(heading);
  });

  // Initial update of previews
  updatePreview();
});
// Update user form width preview
$('input[name="styles[userform][width]"]').on("input", function () {
  var width = $(this).val() || "500px";
  $("#userDetailsForm-preview").css("width", width);

  // Update preview text
  var previewContainer = $(this).closest("div").next();
  var previewText = previewContainer.find(".preview-info");
  if (previewText.length === 0) {
    previewContainer.append(
      '<div class="preview-info" style="text-align: center; margin-top: 10px; font-size: 13px; color: #6b7280;">Width: ' +
        width +
        "</div>"
    );
  } else {
    previewText.text("Width: " + width);
  }
});

// Update preview when form selection changes
$("#selected_form_id").on("change", function () {
  var formId = $(this).val();
  var previewContainer = $("#userDetailsForm-preview");

  if (formId > 0) {
    // You can add AJAX here to load the actual form preview
    // For now, just update the placeholder
    previewContainer.html(
      '<div style="text-align: center; padding: 40px 20px; color: #6b7280;">' +
        '<div style="font-size: 48px; margin-bottom: 20px; color: #05D686;">✓</div>' +
        '<h4 style="margin: 0 0 10px 0; color: #374151;">Form Selected</h4>' +
        '<p style="margin: 0; font-size: 14px;">Form ID: ' +
        formId +
        "</p>" +
        '<p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af;">Actual form will appear here</p>' +
        "</div>"
    );
  } else {
    previewContainer.html(
      '<div style="text-align: center; padding: 40px 20px; color: #6b7280;">' +
        '<div style="font-size: 48px; margin-bottom: 20px; color: #d1d5db;">📋</div>' +
        '<h4 style="margin: 0 0 10px 0; color: #374151;">No Form Selected</h4>' +
        '<p style="margin: 0; font-size: 14px;">Select a form above to preview it here</p>' +
        "</div>"
    );
  }
});
