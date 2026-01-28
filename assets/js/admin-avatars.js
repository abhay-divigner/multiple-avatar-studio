// admin-avatars.js
document.addEventListener("DOMContentLoaded", function () {
  // Vendor selection modal
  const addAvatarBtn = document.getElementById("add-avatar-btn");
  const vendorModal = document.getElementById("vendor-selection-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");

  if (addAvatarBtn && vendorModal) {
    addAvatarBtn.addEventListener("click", function () {
      vendorModal.style.display = "block";
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", function () {
        vendorModal.style.display = "none";
      });
    }

    vendorModal.addEventListener("click", function (e) {
      if (e.target.id === "vendor-selection-modal") {
        vendorModal.style.display = "none";
      }
    });
  }

  // Avatar table functionality
  const avatarTable = document.querySelector(".avatar-table");
  if (avatarTable) {
    // Toggle expand/collapse on row click
    avatarTable.addEventListener("click", function (e) {
      const mainRow = e.target.closest(".main-row");
      if (mainRow && !e.target.closest(".action-buttons")) {
        const detailsRow = mainRow.nextElementSibling;
        if (detailsRow && detailsRow.classList.contains("details-row")) {
          mainRow.classList.toggle("expanded");
          detailsRow.classList.toggle("visible");
        }
      }
    });

    // Copy shortcode functionality
    avatarTable.addEventListener("click", function (e) {
      const copyBtn = e.target.closest(".copy-shortcode-btn");
      if (copyBtn) {
        e.stopPropagation();
        const shortcode = copyBtn.dataset.shortcode;

        // Create temporary input
        const tempInput = document.createElement("input");
        document.body.appendChild(tempInput);
        tempInput.value = shortcode;
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(function () {
          copyBtn.textContent = originalText;
        }, 2000);
      }
    });
  }

  // Default avatar thumbnail upload functionality
  setupDefaultAvatarUpload();
});

function setupDefaultAvatarUpload() {
  const avatarPlaceholder = document.getElementById(
    "default-avatar-placeholder"
  );
  const previewImg = document.getElementById("default-avatar-preview");
  const editBtn = document.getElementById("edit-avatar-btn");
  const removeBtn = document.getElementById("remove-avatar-btn");
  const avatarForm = document.getElementById("default-avatar-form");
  const imageIdInput = document.getElementById("default-avatar-image-id");
  const overlay = document.querySelector(".avatar-hover-overlay");

  if (!avatarPlaceholder && !previewImg) return;

  let mediaUploader;

  // Show/hide overlay on hover with smooth fade
  const avatarWrapper = document.querySelector(".avatar-preview-wrapper");
  if (avatarWrapper && overlay) {
    avatarWrapper.addEventListener("mouseenter", function () {
      overlay.style.opacity = "1";
    });

    avatarWrapper.addEventListener("mouseleave", function () {
      overlay.style.opacity = "0";
    });
  }

  // Hover effect on action buttons
  const actionBtns = document.querySelectorAll(".avatar-action-btn");
  actionBtns.forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });

  // Hover effect on placeholder
  if (avatarPlaceholder) {
    avatarPlaceholder.addEventListener("mouseenter", function () {
      this.style.background = "#e5e7eb";
      this.style.borderColor = "#9ca3af";
    });

    avatarPlaceholder.addEventListener("mouseleave", function () {
      this.style.background = "#f3f4f6";
      this.style.borderColor = "#d1d5db";
    });

    avatarPlaceholder.addEventListener("click", function (e) {
      e.preventDefault();
      openMediaUploader();
    });
  }

  // Click on preview image to upload
  if (previewImg) {
    previewImg.addEventListener("click", function (e) {
      if (overlay && getComputedStyle(overlay).opacity === "0") {
        e.preventDefault();
        openMediaUploader();
      }
    });
  }

  // Click on edit button to upload
  if (editBtn) {
    editBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openMediaUploader();
    });
  }

  // Click on remove button
  if (removeBtn) {
    removeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (previewImg) {
        previewImg.src = "";
        previewImg.style.display = "none";
      }
      if (avatarPlaceholder) {
        avatarPlaceholder.style.display = "flex";
      }
      if (imageIdInput) {
        imageIdInput.value = "";
      }
      if (overlay) {
        overlay.style.display = "none";
      }

      // Auto-save the removal
      if (avatarForm) {
        avatarForm.submit();
      }
    });
  }

  function openMediaUploader() {
    if (mediaUploader) {
      mediaUploader.open();
      return;
    }

    if (typeof wp === "undefined" || typeof wp.media === "undefined") {
      console.error("WordPress media library not available");
      return;
    }

    mediaUploader = wp.media({
      title: "Choose Default Avatar Thumbnail",
      button: {
        text: "Use this image",
      },
      multiple: false,
      library: {
        type: "image",
      },
    });

    mediaUploader.on("select", function () {
      const attachment = mediaUploader
        .state()
        .get("selection")
        .first()
        .toJSON();

      if (previewImg) {
        previewImg.src = attachment.url;
        previewImg.style.display = "block";
      }

      if (avatarPlaceholder) {
        avatarPlaceholder.style.display = "none";
      }

      if (imageIdInput) {
        imageIdInput.value = attachment.id;
      }

      if (overlay) {
        overlay.style.display = "flex";
      }

      // Auto-save the image
      if (avatarForm) {
        avatarForm.submit();
      }
    });

    mediaUploader.open();
  }
}
