// admin-sessions.js
let totalPages = 0;

function copyToClipboard(text, button) {
  // Create temporary textarea
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);

  // Select and copy
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  // Visual feedback
  button.classList.add("copied");

  // Reset after 2 seconds
  setTimeout(() => {
    button.classList.remove("copied");
  }, 2000);
}

function showUserDetails(sessionId) {
  const userData = document.getElementById("user-data-" + sessionId);
  const modal = document.getElementById("userDetailsModal");
  const content = document.getElementById("userDetailsContent");

  if (!userData) {
    content.innerHTML =
      '<div class="no-user-data"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>No user data available for this session</p></div>';
    modal.classList.add("active");
    return;
  }

  const data = JSON.parse(userData.textContent);

  if (!data) {
    content.innerHTML =
      '<div class="no-user-data"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>No user information found for this session</p></div>';
  } else {
    content.innerHTML = `
            <div class="user-detail-row">
                <div class="user-detail-label">Full Name</div>
                <div class="user-detail-value ${
                  !data.full_name ? "empty" : ""
                }">${data.full_name || "Not provided"}</div>
            </div>
            <div class="user-detail-row">
                <div class="user-detail-label">Email Address</div>
                <div class="user-detail-value ${!data.email ? "empty" : ""}">${
      data.email || "Not provided"
    }</div>
            </div>
            <div class="user-detail-row">
                <div class="user-detail-label">Mobile Number</div>
                <div class="user-detail-value ${!data.mobile ? "empty" : ""}">${
      data.mobile || "Not provided"
    }</div>
            </div>
            <div class="user-detail-row">
                <div class="user-detail-label">Country Code</div>
                <div class="user-detail-value ${
                  !data.country_code ? "empty" : ""
                }">${data.country_code || "Not provided"}</div>
            </div>
            <div class="user-detail-row">
                <div class="user-detail-label">Conversation ID</div>
                <div class="user-detail-value" style="display: flex; align-items: center; gap: 10px;">
                    <code style="flex: 1;">${
                      data.conversation_id || "N/A"
                    }</code>
                    ${
                      data.conversation_id
                        ? `<button class="copy-btn" onclick="copyToClipboard('${data.conversation_id}', this)" title="Copy Conversation ID">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>`
                        : ""
                    }
                </div>
            </div>
            <div class="user-detail-row">
                <div class="user-detail-label">Created At</div>
                <div class="user-detail-value">${data.created_at || "N/A"}</div>
            </div>
        `;
  }

  modal.classList.add("active");
}

function closeUserDetails() {
  const modal = document.getElementById("userDetailsModal");
  modal.classList.remove("active");
}

function jumpToPage() {
  const pageInput = document.getElementById("pageJumpInput");
  const page = parseInt(pageInput.value);

  if (page >= 1 && page <= totalPages) {
    const url = new URL(window.location.href);
    url.searchParams.set("paged", page);
    window.location.href = url.toString();
  } else {
    alert("Please enter a valid page number between 1 and " + totalPages);
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", function () {
  // Set totalPages from PHP variable
  totalPages =
    typeof avatarStudioSessionsVars !== "undefined"
      ? avatarStudioSessionsVars.total_pages
      : 0;

  // Handle Enter key in page jump input
  const pageJumpInput = document.getElementById("pageJumpInput");
  if (pageJumpInput) {
    pageJumpInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        jumpToPage();
      }
    });
  }

  // Close modal when clicking outside
  const userDetailsModal = document.getElementById("userDetailsModal");
  if (userDetailsModal) {
    userDetailsModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeUserDetails();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeUserDetails();
    }
  });
});
