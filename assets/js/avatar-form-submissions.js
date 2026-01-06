(function ($) {
  "use strict";

  // Global variables
  const config = window.avatarFormSubmissions || {};

  // Initialize
  $(document).ready(function () {
    initSubmissionsPage();
  });

  function initSubmissionsPage() {
    // Copy to clipboard functionality
    $(document).on("click", ".copy-btn", function () {
      const sessionId =
        $(this).siblings(".badge").attr("title") ||
        $(this).siblings(".badge").text();
      copyToClipboard(sessionId, $(this));
    });

    // Page jump functionality
    $("#page-jump-input").on("keypress", function (e) {
      if (e.key === "Enter") {
        jumpToPage();
      }
    });

    $(".page-jump-btn").on("click", jumpToPage);

    // Bulk selection functionality
    $("#select-all-checkbox").on("change", function () {
      toggleSelectAll(this);
    });

    $(document).on("change", ".submission-checkbox", updateBulkActions);

    // Bulk action buttons
    $(".button-bulk-export").on("click", exportSelectedSubmissions);
    $(".button-bulk-export-all").on("click", exportAllSubmissions);
    $(".button-bulk-delete").on("click", showBulkDeleteModal);
    $(".button-bulk-clear").on("click", clearSelection);

    // Modal controls
    $(".modal-btn-cancel").on("click", closeBulkDeleteModal);
    $(".modal-btn-delete").on("click", confirmBulkDelete);

    // Close modal on background click or escape
    $(document).on("click", function (e) {
      if ($(e.target).is("#bulk-delete-modal")) {
        closeBulkDeleteModal();
      }
    });

    $(document).on("keydown", function (e) {
      if (e.key === "Escape") {
        closeBulkDeleteModal();
      }
    });

    // Field expansion
    $(document).on("click", ".expand-field", function () {
      const fieldValue = $(this).siblings(".field-value");
      const fullValue = fieldValue.data("full-value");

      if ($(this).text() === "↗") {
        const fullDiv = $("<div>").addClass("field-full-value").text(fullValue);
        fieldValue.after(fullDiv);
        $(this).text("↘");
      } else {
        fieldValue.siblings(".field-full-value").remove();
        $(this).text("↗");
      }
    });
  }

  // Utility functions
  function copyToClipboard(text, button) {
    navigator.clipboard
      .writeText(text)
      .then(function () {
        const originalText = button.html();
        button.html("✓ Copied");
        button.addClass("copied");

        setTimeout(function () {
          button.html(originalText);
          button.removeClass("copied");
        }, 2000);
      })
      .catch(function (err) {
        console.error("Failed to copy: ", err);
      });
  }

  function jumpToPage() {
    const pageInput = $("#page-jump-input");
    const pageNum = parseInt(pageInput.val());
    const totalPages = parseInt(pageInput.attr("max"));

    if (pageNum >= 1 && pageNum <= totalPages) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("paged", pageNum);
      window.location.href = currentUrl.toString();
    } else {
      alert("Please enter a valid page number between 1 and " + totalPages);
    }
  }

  // Bulk selection functions
  function toggleSelectAll(checkbox) {
    const isChecked = $(checkbox).is(":checked");
    $(".submission-checkbox").prop("checked", isChecked);
    updateBulkActions();
  }

  function updateBulkActions() {
    const selectedCheckboxes = $(".submission-checkbox:checked");
    const selectedCount = selectedCheckboxes.length;

    $("#selected-count").text(selectedCount + " selected");
    $("#select-all-checkbox").prop(
      "checked",
      selectedCount === $(".submission-checkbox").length && selectedCount > 0
    );
  }

  function clearSelection() {
    $(".submission-checkbox").prop("checked", false);
    $("#select-all-checkbox").prop("checked", false);
    updateBulkActions();
  }

  // Bulk delete functions
  function showBulkDeleteModal() {
    const selectedCheckboxes = $(".submission-checkbox:checked");
    const selectedCount = selectedCheckboxes.length;

    if (selectedCount === 0) {
      alert("Please select at least one submission to delete.");
      return;
    }

    $("#bulk-selected-count").text(selectedCount + " submission(s)");
    $("#bulk-delete-modal").addClass("active");
    $("body").css("overflow", "hidden");
  }

  function closeBulkDeleteModal() {
    $("#bulk-delete-modal").removeClass("active");
    $("body").css("overflow", "auto");
  }

  function confirmBulkDelete() {
    const selectedCheckboxes = $(".submission-checkbox:checked");
    const container = $("#bulk-delete-submissions-container");
    container.empty();

    selectedCheckboxes.each(function () {
      container.append(
        $("<input>").attr({
          type: "hidden",
          name: "selected_submissions[]",
          value: $(this).val(),
        })
      );
    });

    $("#bulk-delete-form").submit();
  }

  // Export functions
  function exportSelectedSubmissions() {
    const selectedCheckboxes = $(".submission-checkbox:checked");

    if (selectedCheckboxes.length === 0) {
      alert("Please select at least one submission to export.");
      return false;
    }

    // Get selected submission IDs
    const selectedSubmissions = [];
    selectedCheckboxes.each(function () {
      selectedSubmissions.push($(this).val());
    });

    // Show loading state
    const exportBtn = $(".button-bulk-export");
    const originalText = exportBtn.html();
    exportBtn.html("⏳ Exporting...").prop("disabled", true);

    // Submit via AJAX
    $.ajax({
      url: config.ajax_url,
      type: "POST",
      data: {
        action: "avatar_studio_export_submissions_csv",
        nonce: config.export_nonce,
        form_id: config.form_id,
        selected_submissions: selectedSubmissions,
      },
      xhrFields: {
        responseType: "blob",
      },
      success: function (blob) {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download =
          "form-submissions-" +
          config.form_id +
          "-" +
          new Date().toISOString().slice(0, 19).replace(/:/g, "-") +
          ".csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: function () {
        alert("Error exporting submissions. Please try again.");
      },
      complete: function () {
        exportBtn.html(originalText).prop("disabled", false);
      },
    });

    return false;
  }

  function exportAllSubmissions() {
    // Show loading state
    const exportAllBtn = $(".button-bulk-export-all");
    const originalText = exportAllBtn.html();
    exportAllBtn.html("⏳ Exporting All...").prop("disabled", true);

    // Submit via AJAX
    $.ajax({
      url: config.ajax_url,
      type: "POST",
      data: {
        action: "avatar_studio_export_submissions_csv",
        nonce: config.export_nonce,
        form_id: config.form_id,
        export_all: 1,
      },
      xhrFields: {
        responseType: "blob",
      },
      success: function (blob) {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download =
          "form-submissions-all-" +
          config.form_id +
          "-" +
          new Date().toISOString().slice(0, 19).replace(/:/g, "-") +
          ".csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: function () {
        alert("Error exporting submissions. Please try again.");
      },
      complete: function () {
        exportAllBtn.html(originalText).prop("disabled", false);
      },
    });

    return false;
  }
})(jQuery);
