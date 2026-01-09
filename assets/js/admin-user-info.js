// admin-user-info.js
let totalPages = 0;

function copyConversationId(id, button) {
  navigator.clipboard
    .writeText(id)
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

function jumpToPage() {
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

// Bulk selection functions
function toggleSelectAll(checkbox) {
  const userCheckboxes = document.querySelectorAll(".user-checkbox");
  userCheckboxes.forEach((cb) => {
    cb.checked = checkbox.checked;
  });
  updateBulkActions();
}

function updateBulkActions() {
  const selectedCheckboxes = document.querySelectorAll(
    ".user-checkbox:checked"
  );
  const selectedCount = document.getElementById("selected-count");

  if (selectedCount) {
    selectedCount.textContent = selectedCheckboxes.length + " selected";
  }

  const selectAllCheckbox = document.getElementById("select-all-checkbox");
  if (selectAllCheckbox) {
    selectAllCheckbox.checked =
      selectedCheckboxes.length ===
      document.querySelectorAll(".user-checkbox").length;
  }
}

function clearSelection() {
  document.querySelectorAll(".user-checkbox").forEach((cb) => {
    cb.checked = false;
  });

  const selectAllCheckbox = document.getElementById("select-all-checkbox");
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = false;
  }
  updateBulkActions();
}

// Bulk delete functions
function showBulkDeleteModal() {
  const selectedCheckboxes = document.querySelectorAll(
    ".user-checkbox:checked"
  );
  const bulkSelectedCount = document.getElementById("bulk-selected-count");

  if (bulkSelectedCount) {
    bulkSelectedCount.textContent = selectedCheckboxes.length + " user(s)";
  }

  const modal = document.getElementById("bulk-delete-modal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeBulkDeleteModal() {
  const modal = document.getElementById("bulk-delete-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

function confirmBulkDelete() {
  const selectedCheckboxes = document.querySelectorAll(
    ".user-checkbox:checked"
  );
  const container = document.getElementById("bulk-delete-users-container");

  if (container) {
    container.innerHTML = "";

    selectedCheckboxes.forEach((checkbox) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "selected_users[]";
      input.value = checkbox.value;
      container.appendChild(input);
    });

    document.getElementById("bulk-delete-form").submit();
  }
}

// Export Selected CSV function
function exportSelectedUsers() {
  const selectedCheckboxes = document.querySelectorAll(
    ".user-checkbox:checked"
  );

  if (selectedCheckboxes.length === 0) {
    alert("Please select at least one user to export.");
    return false;
  }

  // Get selected user IDs
  const selectedUsers = Array.from(selectedCheckboxes).map(
    (checkbox) => checkbox.value
  );

  // Show loading state
  const exportBtn = document.querySelector(".button-bulk-export");
  if (exportBtn) {
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = "⏳ Exporting...";
    exportBtn.disabled = true;

    // Create a hidden form and submit it
    const form = document.createElement("form");
    form.method = "POST";
    form.action = avatarStudioUserInfoVars.ajax_url || "";
    form.style.display = "none";

    // Add action
    const actionInput = document.createElement("input");
    actionInput.type = "hidden";
    actionInput.name = "action";
    actionInput.value = "avanew_as_avatar_studio_export_csv";
    form.appendChild(actionInput);

    // Add nonce
    const nonceInput = document.createElement("input");
    nonceInput.type = "hidden";
    nonceInput.name = "nonce";
    nonceInput.value = avatarStudioUserInfoVars.export_nonce || "";
    form.appendChild(nonceInput);

    // Add selected user IDs
    selectedUsers.forEach((userId) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "selected_users[]";
      input.value = userId;
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
  }

  return false;
}

// Export All CSV function
function exportAllUsers() {
  // Show loading state
  const exportAllBtn = document.querySelector(".button-bulk-export-all");
  if (exportAllBtn) {
    const originalText = exportAllBtn.innerHTML;
    exportAllBtn.innerHTML = "⏳ Exporting All...";
    exportAllBtn.disabled = true;

    // Create a hidden form and submit it
    const form = document.createElement("form");
    form.method = "POST";
    form.action = avatarStudioUserInfoVars.ajax_url || "";
    form.style.display = "none";

    // Add action
    const actionInput = document.createElement("input");
    actionInput.type = "hidden";
    actionInput.name = "action";
    actionInput.value = "avanew_as_avatar_studio_export_csv";
    form.appendChild(actionInput);

    // Add nonce
    const nonceInput = document.createElement("input");
    nonceInput.type = "hidden";
    nonceInput.name = "nonce";
    nonceInput.value = avatarStudioUserInfoVars.export_nonce || "";
    form.appendChild(nonceInput);

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
  }

  return false;
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", function () {
  // Set totalPages from PHP variable
  totalPages =
    typeof avatarStudioUserInfoVars !== "undefined"
      ? avatarStudioUserInfoVars.total_pages
      : 0;

  // Handle Enter key in page jump input
  const pageInput = document.getElementById("page-jump-input");
  if (pageInput) {
    pageInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        jumpToPage();
      }
    });
  }

  // Close modal on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeBulkDeleteModal();
    }
  });

  // Close modal on backdrop click
  document.addEventListener("click", function (e) {
    if (e.target.id === "bulk-delete-modal") {
      closeBulkDeleteModal();
    }
  });

  // Initialize bulk actions
  updateBulkActions();
});
