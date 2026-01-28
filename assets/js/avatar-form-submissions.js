(function ($) {
  "use strict";

  // Global variables that need to be passed from PHP
  let avatarFormBuilder = window.avatarFormBuilder || {};

  /**
   * Copy text to clipboard
   */
  function copyToClipboard(text, button) {
    navigator.clipboard
      .writeText(text)
      .then(function () {
        const originalText = button.innerHTML;
        button.innerHTML = "✓ Copied";
        button.classList.add("copied");

        setTimeout(function () {
          button.innerHTML = originalText;
          button.classList.remove("copied");
        }, 2000);
      })
      .catch(function (err) {
        console.error("Failed to copy: ", err);
      });
  }

  /**
   * Jump to specific page in pagination
   */
  function jumpToPage(totalPages) {
    const pageInput = document.getElementById("page-jump-input");
    const pageNum = parseInt(pageInput.value);

    if (pageNum >= 1 && pageNum <= totalPages) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("paged", pageNum);
      window.location.href = currentUrl.toString();
    } else {
      alert("Please enter a valid page number between 1 and " + totalPages);
    }
  }

  /**
   * Toggle all checkboxes
   */
  function toggleSelectAll(checkbox) {
    const submissionCheckboxes = document.querySelectorAll(
      ".submission-checkbox"
    );
    submissionCheckboxes.forEach((cb) => {
      cb.checked = checkbox.checked;
    });
    updateBulkActions();
  }

  /**
   * Update bulk action buttons state
   */
  function updateBulkActions() {
    const selectedCheckboxes = document.querySelectorAll(
      ".submission-checkbox:checked"
    );
    const selectedCount = document.getElementById("selected-count");

    if (selectedCount) {
      selectedCount.textContent = selectedCheckboxes.length + " selected";
    }

    const selectAllCheckbox = document.getElementById("select-all-checkbox");
    if (selectAllCheckbox) {
      selectAllCheckbox.checked =
        selectedCheckboxes.length ===
        document.querySelectorAll(".submission-checkbox").length;
    }
  }

  /**
   * Clear all selections
   */
  function clearSelection() {
    document.querySelectorAll(".submission-checkbox").forEach((cb) => {
      cb.checked = false;
    });

    const selectAllCheckbox = document.getElementById("select-all-checkbox");
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = false;
    }

    updateBulkActions();
  }

  /**
   * Show bulk delete confirmation modal
   */
  function showBulkDeleteModal() {
    const selectedCheckboxes = document.querySelectorAll(
      ".submission-checkbox:checked"
    );
    const bulkSelectedCount = document.getElementById("bulk-selected-count");
    const bulkDeleteModal = document.getElementById("bulk-delete-modal");

    if (bulkSelectedCount) {
      bulkSelectedCount.textContent =
        selectedCheckboxes.length + " submission(s)";
    }

    if (bulkDeleteModal) {
      bulkDeleteModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  /**
   * Close bulk delete modal
   */
  function closeBulkDeleteModal() {
    const bulkDeleteModal = document.getElementById("bulk-delete-modal");
    if (bulkDeleteModal) {
      bulkDeleteModal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  }

  /**
   * Confirm and submit bulk delete
   */
  function confirmBulkDelete() {
    const selectedCheckboxes = document.querySelectorAll(
      ".submission-checkbox:checked"
    );
    const container = document.getElementById(
      "bulk-delete-submissions-container"
    );

    if (container) {
      container.innerHTML = "";

      selectedCheckboxes.forEach((checkbox) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "selected_submissions[]";
        input.value = checkbox.value;
        container.appendChild(input);
      });

      const bulkDeleteForm = document.getElementById("bulk-delete-form");
      if (bulkDeleteForm) {
        bulkDeleteForm.submit();
      }
    }
  }

  /**
   * Export selected submissions to CSV
   */
  function exportSelectedSubmissions() {
    const selectedCheckboxes = document.querySelectorAll(
      ".submission-checkbox:checked"
    );

    if (selectedCheckboxes.length === 0) {
      alert("Please select at least one submission to export.");
      return false;
    }

    // Get selected submission IDs
    const selectedSubmissions = Array.from(selectedCheckboxes).map(
      (checkbox) => checkbox.value
    );

    // Show loading state
    const exportBtn = document.querySelector(".button-bulk-export");
    if (!exportBtn) return false;

    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = "⏳ Exporting...";
    exportBtn.disabled = true;

    // Create a hidden form and submit it via AJAX
    const form = document.createElement("form");
    form.method = "POST";
    form.action = avatarFormBuilder.ajax_url || ajaxurl;
    form.style.display = "none";

    // Add action
    const actionInput = document.createElement("input");
    actionInput.type = "hidden";
    actionInput.name = "action";
    actionInput.value = "avanew_as_avatar_studio_export_submissions_csv";
    form.appendChild(actionInput);

    // Add nonce
    const nonceInput = document.createElement("input");
    nonceInput.type = "hidden";
    nonceInput.name = "nonce";
    nonceInput.value = avatarFormBuilder.export_nonce || "";
    form.appendChild(nonceInput);

    // Add form_id
    const formIdInput = document.createElement("input");
    formIdInput.type = "hidden";
    formIdInput.name = "form_id";
    formIdInput.value = avatarFormBuilder.form_id || "";
    form.appendChild(formIdInput);

    // Add selected submission IDs
    selectedSubmissions.forEach((submissionId) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "selected_submissions[]";
      input.value = submissionId;
      form.appendChild(input);
    });

    // Add form to document and submit
    document.body.appendChild(form);
    form.submit();

    // Remove form after submission and reset button
    setTimeout(() => {
      document.body.removeChild(form);
      exportBtn.innerHTML = originalText;
      exportBtn.disabled = false;
    }, 3000);

    return false;
  }

  /**
   * Export all submissions to CSV
   */
  function exportAllSubmissions() {
    // Show loading state
    const exportAllBtn = document.querySelector(".button-bulk-export-all");
    if (!exportAllBtn) return false;

    const originalText = exportAllBtn.innerHTML;
    exportAllBtn.innerHTML = "⏳ Exporting All...";
    exportAllBtn.disabled = true;

    // Create a hidden form and submit it via AJAX
    const form = document.createElement("form");
    form.method = "POST";
    form.action = avatarFormBuilder.ajax_url || ajaxurl;
    form.style.display = "none";

    // Add action
    const actionInput = document.createElement("input");
    actionInput.type = "hidden";
    actionInput.name = "action";
    actionInput.value = "avanew_as_avatar_studio_export_submissions_csv";
    form.appendChild(actionInput);

    // Add nonce
    const nonceInput = document.createElement("input");
    nonceInput.type = "hidden";
    nonceInput.name = "nonce";
    nonceInput.value = avatarFormBuilder.export_nonce || "";
    form.appendChild(nonceInput);

    // Add form_id
    const formIdInput = document.createElement("input");
    formIdInput.type = "hidden";
    formIdInput.name = "form_id";
    formIdInput.value = avatarFormBuilder.form_id || "";
    form.appendChild(formIdInput);

    // Add export_all flag
    const exportAllInput = document.createElement("input");
    exportAllInput.type = "hidden";
    exportAllInput.name = "export_all";
    exportAllInput.value = "1";
    form.appendChild(exportAllInput);

    // Add form to document and submit
    document.body.appendChild(form);
    form.submit();

    // Remove form after submission and reset button
    setTimeout(() => {
      document.body.removeChild(form);
      exportAllBtn.innerHTML = originalText;
      exportAllBtn.disabled = false;
    }, 3000);

    return false;
  }

  /**
   * Expand/collapse field values
   */
  function expandField(fieldId, button) {
    const fieldValue = document.getElementById(fieldId);
    if (!fieldValue) return;

    const fullValue = fieldValue.getAttribute("data-full-value");

    if (button.innerHTML === "↗") {
      const fullDiv = document.createElement("div");
      fullDiv.className = "field-full-value";
      fullDiv.textContent = fullValue;
      fieldValue.parentNode.appendChild(fullDiv);
      button.innerHTML = "↘";
    } else {
      const fullDiv = fieldValue.parentNode.querySelector(".field-full-value");
      if (fullDiv) {
        fullDiv.remove();
      }
      button.innerHTML = "↗";
    }
  }

  /**
   * Initialize event listeners
   */
  function initEventListeners() {
    // Page jump input
    const pageInput = document.getElementById("page-jump-input");
    if (pageInput) {
      pageInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          if (avatarFormBuilder.total_pages) {
            jumpToPage(avatarFormBuilder.total_pages);
          }
        }
      });
    }

    // Close modal on escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeBulkDeleteModal();
      }
    });

    // Close modal when clicking outside
    document.addEventListener("click", function (e) {
      if (e.target.id === "bulk-delete-modal") {
        closeBulkDeleteModal();
      }
    });

    // Bind checkbox change events
    document.addEventListener("change", function (e) {
      if (e.target.classList.contains("submission-checkbox")) {
        updateBulkActions();
      }
    });
  }

  /**
   * Make functions available globally
   */
  window.avatarFormSubmissions = {
    copyToClipboard: copyToClipboard,
    jumpToPage: function () {
      if (avatarFormBuilder.total_pages) {
        jumpToPage(avatarFormBuilder.total_pages);
      }
    },
    toggleSelectAll: toggleSelectAll,
    updateBulkActions: updateBulkActions,
    clearSelection: clearSelection,
    showBulkDeleteModal: showBulkDeleteModal,
    closeBulkDeleteModal: closeBulkDeleteModal,
    confirmBulkDelete: confirmBulkDelete,
    exportSelectedSubmissions: exportSelectedSubmissions,
    exportAllSubmissions: exportAllSubmissions,
    expandField: expandField,
  };

  /**
   * Initialize when DOM is ready
   */
  document.addEventListener("DOMContentLoaded", function () {
    initEventListeners();

    // Initialize bulk actions counter
    updateBulkActions();
  });
})(jQuery);
