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
